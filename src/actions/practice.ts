"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessWebsite } from "@/lib/access";
import { track } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { SCORING } from "@/lib/constants";
import { bugReportSchema, fieldErrors, paymentRequestSchema } from "@/lib/validation";
import { saveEvidence } from "@/lib/evidence";
import { autoScoreReport, recomputeAttempt } from "@/lib/scoring/service";
import type { FormState } from "@/components/ui/form";

const str = (fd: FormData, k: string) => (typeof fd.get(k) === "string" ? (fd.get(k) as string) : "");

async function loadSite(websiteId: string) {
  return db.practiceWebsite.findFirst({
    where: { id: websiteId, status: "PUBLISHED", level: { status: "PUBLISHED" } },
    include: { level: { select: { id: true, slug: true, accessRule: true } } },
  });
}

export async function startAttemptAction(websiteId: string, path: string) {
  const user = await requireUser(path);
  const site = await loadSite(websiteId);
  if (!site || !(await canAccessWebsite(user.id, user.role, site))) redirect(path);

  const existing = await db.attempt.findFirst({ where: { userId: user.id, websiteId, status: "IN_PROGRESS" } });
  if (!existing) {
    const count = await db.attempt.count({ where: { userId: user.id, websiteId } });
    if (user.role === "LEARNER" && count >= site.maxAttempts) redirect(path);
    const attempt = await db.attempt.create({
      data: { userId: user.id, websiteId, websiteVersion: site.version, attemptNumber: count + 1 },
    });
    await track("attempt_started", user.id, { websiteId, attemptNumber: attempt.attemptNumber });
  }
  revalidatePath(path);
  redirect(path);
}

export async function submitReportAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const attemptId = str(fd, "attemptId");
  const attempt = await db.attempt.findFirst({
    where: { id: attemptId, userId: user.id, status: "IN_PROGRESS" },
    include: { website: { select: { requireSeverity: true, slug: true, level: { select: { slug: true } } } }, _count: { select: { reports: true } } },
  });
  if (!attempt) return { message: "This testing session is no longer active. Return to the practice website to start a new one." };

  const values = Object.fromEntries(["title", "description", "steps", "expected", "actual", "severity", "environment"].map((k) => [k, str(fd, k)]));
  const parsed = bugReportSchema(attempt.website.requireSeverity).safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  if (attempt._count.reports >= SCORING.maxReportsPerAttempt) {
    return { message: `You've reached the limit of ${SCORING.maxReportsPerAttempt} reports for this attempt.`, values };
  }
  if (!(await rateLimit(`report:${user.id}`, 1, SCORING.minSecondsBetweenReports))) {
    return { message: "You're submitting reports very quickly. Take a moment to double-check your report and try again.", values };
  }

  const file = fd.get("evidence");
  const hasFile = file instanceof File && file.size > 0;

  const id = randomUUID();
  let evidencePath: string | null = null;
  if (hasFile) {
    const saved = await saveEvidence(id, file);
    if (!saved.ok) return { errors: { evidence: saved.error }, values };
    evidencePath = saved.path;
  }

  const d = parsed.data;
  await db.bugReport.create({
    data: {
      id,
      attemptId: attempt.id,
      title: d.title,
      description: d.description ?? "",
      steps: d.steps,
      expected: d.expected,
      actual: d.actual,
      severity: d.severity || null,
      environment: d.environment ?? "",
      evidencePath,
    },
  });
  await autoScoreReport(id);
  await track("bug_report_submitted", user.id, { attemptId: attempt.id });
  revalidatePath(`/practice-lab/${attempt.website.level.slug}/${attempt.website.slug}`);
  return { ok: true, data: { id: id.slice(-6).toUpperCase() } };
}

export async function finishAttemptAction(attemptId: string) {
  const user = await requireUser();
  const attempt = await db.attempt.findFirst({ where: { id: attemptId, userId: user.id, status: "IN_PROGRESS" } });
  if (!attempt) redirect("/practice-lab");
  await db.attempt.update({ where: { id: attempt.id }, data: { finishedAt: new Date(), status: "PROCESSING" } });
  await recomputeAttempt(attempt.id, { finalize: true });
  await track("attempt_finished", user.id, { attemptId });
  redirect(`/practice-lab/results/${attempt.id}?done=1`);
}

export async function requestReviewAction(reportId: string) {
  const user = await requireUser();
  const report = await db.bugReport.findFirst({
    where: { id: reportId, status: "UNSUPPORTED", attempt: { userId: user.id, finishedAt: { not: null } } },
  });
  if (!report) return;
  await db.bugReport.update({
    where: { id: report.id },
    data: { status: "NEEDS_REVIEW", feedback: "A reviewer is checking this report. You'll see the outcome on this page." },
  });
  await recomputeAttempt(report.attemptId, { finalize: true });
  revalidatePath(`/practice-lab/results/${report.attemptId}`);
}

export async function requestAccessAction(websiteId: string, levelId: string, _: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = paymentRequestSchema.safeParse({ reference: str(fd, "reference"), note: str(fd, "note") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { reference: str(fd, "reference") } };

  const target = websiteId
    ? await db.practiceWebsite.findFirst({ where: { id: websiteId, status: "PUBLISHED" }, select: { id: true, priceEtb: true } })
    : await db.level.findFirst({ where: { id: levelId, status: "PUBLISHED" }, select: { id: true, priceEtb: true } });
  if (!target) return { message: "We couldn't find that challenge." };

  const pending = await db.payment.findFirst({
    where: { userId: user.id, status: "PENDING", ...(websiteId ? { websiteId } : { levelId }) },
  });
  if (pending) return { ok: true, message: "Your payment is already pending confirmation. We'll unlock access as soon as it's verified." };

  await db.payment.create({
    data: {
      userId: user.id,
      websiteId: websiteId || null,
      levelId: websiteId ? null : levelId,
      amountEtb: target.priceEtb,
      reference: parsed.data.reference,
      note: parsed.data.note || null,
    },
  });
  await track("payment_started", user.id, { websiteId, levelId });
  return { ok: true, message: "Thanks — your payment reference was received. Access is unlocked once our team confirms the payment." };
}
