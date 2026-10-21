"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { ROLES, SEVERITIES, LEARN_CATEGORIES } from "@/lib/constants";
import { isValidBug, parseKeywordText } from "@/lib/keywords";
import { recomputeAttempt } from "@/lib/scoring/service";
import { scoreQuality, scoreSeverity } from "@/lib/scoring/score";
import { parseJson, slugify } from "@/lib/utils";

const s = (fd: FormData, k: string) => (typeof fd.get(k) === "string" ? (fd.get(k) as string).trim() : "");
const n = (fd: FormData, k: string, d = 0) => {
  const v = parseInt(s(fd, k), 10);
  return Number.isFinite(v) ? v : d;
};

/** Redirects back to an admin page with a flash message. */
function back(path: string, msg: string, kind: "ok" | "error" = "ok"): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}`);
}

/* ───────────── Submission review ───────────── */

export async function reviewReportAction(reportId: string, fd: FormData) {
  const staff = await requireCapability("review");
  const path = `/admin/submissions/${reportId}`;
  const decision = s(fd, "decision");
  const reason = s(fd, "reason");
  if (reason.length < 5) back(path, "A reason of at least 5 characters is required for every review action.", "error");

  const report = await db.bugReport.findUnique({
    where: { id: reportId },
    include: { attempt: { include: { website: { select: { requireSeverity: true } } } } },
  });
  if (!report) back("/admin/submissions", "Report not found.", "error");

  const before = { status: report!.status, matchedBugId: report!.matchedBugId, pointsOverride: report!.pointsOverride };
  const data: Record<string, unknown> = { reviewNote: reason, reviewedById: staff.id, reviewedAt: new Date() };

  if (decision === "CONFIRM") {
    const bug = await db.bugRegistryItem.findFirst({ where: { id: s(fd, "bugId"), websiteId: report!.attempt.websiteId } });
    if (!bug) back(path, "Choose the registry bug this report matches.", "error");
    const quality = scoreQuality({ ...report!, hasEvidence: !!report!.evidencePath });
    const sev = report!.attempt.website.requireSeverity ? scoreSeverity(report!.severity, bug!.severity) : { points: 0, note: "" };
    Object.assign(data, {
      status: "MATCHED",
      matchedBugId: bug!.id,
      bugPoints: bug!.points,
      qualityPoints: quality.points,
      severityPoints: sev.points,
      pointsOverride: null,
      feedback: ["Confirmed by a reviewer as a valid finding in the area of “" + bug!.learningTopic + "”.", sev.note, ...quality.notes].filter(Boolean).join(" "),
    });
  } else if (decision === "DUPLICATE") {
    Object.assign(data, { status: "DUPLICATE", bugPoints: 0, qualityPoints: 0, severityPoints: 0, pointsOverride: null, feedback: "A reviewer marked this as a duplicate of an issue you already reported." });
  } else if (decision === "UNSUPPORTED") {
    Object.assign(data, { status: "UNSUPPORTED", matchedBugId: null, bugPoints: 0, qualityPoints: 0, severityPoints: 0, pointsOverride: null, feedback: "A reviewer could not match this report to a known issue in this challenge." });
  } else if (decision === "ADJUST") {
    const pts = n(fd, "points", -1);
    if (pts < 0) back(path, "Enter the adjusted points (0 or more).", "error");
    Object.assign(data, { pointsOverride: pts, status: report!.status === "NEEDS_REVIEW" ? "MATCHED" : report!.status, feedback: report!.feedback + " A reviewer adjusted the points for this report." });
  } else back(path, "Choose a review decision.", "error");

  await db.bugReport.update({ where: { id: reportId }, data });
  const result = await recomputeAttempt(report!.attemptId, { finalize: true });
  await audit(staff.id, "report_reviewed", "BugReport", reportId, { decision, reason, before, attemptStatus: result.status, score: result.score });
  revalidatePath("/admin/submissions");
  back(path, "Review saved and the attempt score was recalculated.");
}

/* ───────────── Payments & access ───────────── */

export async function confirmPaymentAction(paymentId: string) {
  const staff = await requireCapability("payments");
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  if (!p || p.status !== "PENDING") back("/admin/payments", "That payment is not pending.", "error");
  await db.$transaction([
    db.payment.update({ where: { id: paymentId }, data: { status: "CONFIRMED", confirmedById: staff.id, confirmedAt: new Date() } }),
    db.entitlement.create({ data: { userId: p!.userId, levelId: p!.levelId, websiteId: p!.websiteId, source: "PAYMENT", paymentId } }),
  ]);
  await audit(staff.id, "payment_confirmed", "Payment", paymentId, { amountEtb: p!.amountEtb, reference: p!.reference });
  back("/admin/payments", "Payment confirmed and access granted.");
}

export async function rejectPaymentAction(paymentId: string, fd: FormData) {
  const staff = await requireCapability("payments");
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  if (!p || p.status !== "PENDING") back("/admin/payments", "That payment is not pending.", "error");
  await db.payment.update({ where: { id: paymentId }, data: { status: "FAILED", confirmedById: staff.id, confirmedAt: new Date(), note: s(fd, "note") || p!.note } });
  await audit(staff.id, "payment_rejected", "Payment", paymentId, { note: s(fd, "note") });
  back("/admin/payments", "Payment marked as failed.");
}

export async function refundPaymentAction(paymentId: string) {
  const staff = await requireCapability("payments");
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  if (!p || p.status !== "CONFIRMED") back("/admin/payments", "Only confirmed payments can be refunded.", "error");
  await db.$transaction([
    db.payment.update({ where: { id: paymentId }, data: { status: "REFUNDED" } }),
    db.entitlement.updateMany({ where: { paymentId }, data: { status: "REVOKED" } }),
  ]);
  await audit(staff.id, "payment_refunded", "Payment", paymentId, { amountEtb: p!.amountEtb });
  back("/admin/payments", "Refund recorded and access revoked.");
}

export async function grantAccessAction(fd: FormData) {
  const staff = await requireCapability("payments");
  const email = s(fd, "email").toLowerCase();
  const target = s(fd, "target"); // "level:<id>" | "website:<id>"
  const user = await db.user.findUnique({ where: { email } });
  if (!user) back("/admin/payments", "No user with that email address.", "error");
  const [kind, id] = target.split(":");
  if (!id || (kind !== "level" && kind !== "website")) back("/admin/payments", "Choose what to grant access to.", "error");
  await db.entitlement.create({
    data: { userId: user!.id, source: "GRANT", ...(kind === "level" ? { levelId: id } : { websiteId: id }) },
  });
  await audit(staff.id, "access_granted", "User", user!.id, { target });
  back("/admin/payments", `Access granted to ${email}.`);
}

/* ───────────── Users ───────────── */

export async function updateUserAction(userId: string, fd: FormData) {
  const staff = await requireCapability("users");
  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) back("/admin/users", "User not found.", "error");
  const data: { role?: string; status?: string } = {};
  const role = s(fd, "role");
  const status = s(fd, "status");
  if (role && role !== target!.role) {
    if (staff.role !== "OWNER") back("/admin/users", "Only the owner can change roles.", "error");
    if (!(ROLES as readonly string[]).includes(role)) back("/admin/users", "Unknown role.", "error");
    data.role = role;
  }
  if (status && status !== target!.status && (status === "ACTIVE" || status === "SUSPENDED")) {
    if (target!.id === staff.id) back("/admin/users", "You can't suspend your own account.", "error");
    data.status = status;
  }
  if (Object.keys(data).length) {
    await db.user.update({ where: { id: userId }, data });
    await audit(staff.id, "user_updated", "User", userId, data);
  }
  back("/admin/users", "User updated.");
}

/* ───────────── Contact messages ───────────── */

export async function resolveMessageAction(id: string, status: "NEW" | "RESOLVED") {
  const staff = await requireCapability("messages");
  await db.contactMessage.update({ where: { id }, data: { status } });
  await audit(staff.id, "message_" + status.toLowerCase(), "ContactMessage", id);
  revalidatePath("/admin/messages");
  back("/admin/messages", status === "RESOLVED" ? "Marked as resolved." : "Reopened.");
}

/* ───────────── Practice content ───────────── */

const SITE_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "PAUSED", "RETIRED"];

export async function createLevelAction(fd: FormData) {
  const staff = await requireCapability("content");
  const name = s(fd, "name");
  const number = n(fd, "number", 0);
  if (!name || number < 1) back("/admin/content", "Enter a level name and number.", "error");
  const slug = `level-${String(number).padStart(2, "0")}`;
  if (await db.level.findFirst({ where: { OR: [{ slug }, { number }] } })) back("/admin/content", "A level with that number already exists.", "error");
  const level = await db.level.create({
    data: {
      slug,
      number,
      name,
      difficulty: s(fd, "difficulty") || name,
      description: s(fd, "description") || "Describe what learners will practice in this level.",
      skills: JSON.stringify(s(fd, "skills").split(",").map((x) => x.trim()).filter(Boolean)),
      accessRule: s(fd, "accessRule") === "PAID" ? "PAID" : "FREE",
      priceEtb: n(fd, "priceEtb"),
      order: number,
    },
  });
  await audit(staff.id, "level_created", "Level", level.id);
  back("/admin/content", `Level ${number} created as a draft.`);
}

export async function updateLevelAction(levelId: string, fd: FormData) {
  const staff = await requireCapability("content");
  const status = s(fd, "status");
  if (!["DRAFT", "PUBLISHED", "PAUSED", "RETIRED"].includes(status)) back("/admin/content", "Unknown status.", "error");
  await db.level.update({
    where: { id: levelId },
    data: {
      name: s(fd, "name"),
      difficulty: s(fd, "difficulty"),
      description: s(fd, "description"),
      skills: JSON.stringify(s(fd, "skills").split(",").map((x) => x.trim()).filter(Boolean)),
      accessRule: s(fd, "accessRule") === "PAID" ? "PAID" : "FREE",
      priceEtb: n(fd, "priceEtb"),
      status,
    },
  });
  await audit(staff.id, "level_updated", "Level", levelId, { status });
  back("/admin/content", "Level saved.");
}

export async function createWebsiteAction(fd: FormData) {
  const staff = await requireCapability("content");
  const name = s(fd, "name");
  const levelId = s(fd, "levelId");
  if (!name || !levelId) back("/admin/content", "Choose a level and enter a website name.", "error");
  const slug = slugify(name);
  if (await db.practiceWebsite.findFirst({ where: { levelId, slug } })) back("/admin/content", "A website with that name already exists in this level.", "error");
  const order = (await db.practiceWebsite.count({ where: { levelId } })) + 1;
  const site = await db.practiceWebsite.create({
    data: {
      levelId,
      slug,
      name,
      description: s(fd, "description") || "Describe this practice website.",
      objective: "Find as many defects as you can in this application.",
      instructions: "Describe the scope, permitted testing behavior and any test data.",
      appUrl: s(fd, "appUrl") || "/",
      order,
    },
  });
  await audit(staff.id, "website_created", "PracticeWebsite", site.id);
  redirect(`/admin/content/${site.id}?ok=${encodeURIComponent("Website created as a draft. Add its bug registry, then publish.")}`);
}

export async function updateWebsiteAction(siteId: string, fd: FormData) {
  const staff = await requireCapability("content");
  const path = `/admin/content/${siteId}`;
  const status = s(fd, "status");
  if (!SITE_STATUSES.includes(status)) back(path, "Unknown status.", "error");

  if (status === "PUBLISHED") {
    const bugs = await db.bugRegistryItem.findMany({ where: { websiteId: siteId, active: true } });
    const site = await db.practiceWebsite.findUnique({ where: { id: siteId }, select: { version: true } });
    const current = bugs.filter((b) => b.version === site!.version);
    if (current.length === 0 || !current.every((b) => isValidBug({ ...b, keywordGroups: parseJson<string[][]>(b.keywordGroups, []) }))) {
      back(path, "A challenge can't be published without a valid bug registry: at least one active bug, and every bug needs points, a title, a learning topic and at least two keyword groups.", "error");
    }
  }

  await db.practiceWebsite.update({
    where: { id: siteId },
    data: {
      name: s(fd, "name"),
      description: s(fd, "description"),
      skills: JSON.stringify(s(fd, "skills").split(",").map((x) => x.trim()).filter(Boolean)),
      objective: s(fd, "objective"),
      instructions: s(fd, "instructions"),
      estimatedMinutes: Math.max(1, n(fd, "estimatedMinutes", 20)),
      accessRule: s(fd, "accessRule") === "PAID" ? "PAID" : "FREE",
      priceEtb: Math.max(0, n(fd, "priceEtb")),
      appUrl: s(fd, "appUrl") || "/",
      maxAttempts: Math.max(1, n(fd, "maxAttempts", 3)),
      requireSeverity: fd.get("requireSeverity") === "on",
      status,
    },
  });
  await audit(staff.id, "website_updated", "PracticeWebsite", siteId, { status });
  back(path, "Website saved.");
}

function bugData(fd: FormData) {
  const severity = s(fd, "severity");
  return {
    code: s(fd, "code").toUpperCase(),
    title: s(fd, "title"),
    description: s(fd, "description"),
    category: s(fd, "category") || "General",
    learningTopic: s(fd, "learningTopic"),
    severity: (SEVERITIES as readonly string[]).includes(severity) ? severity : "MEDIUM",
    points: Math.max(0, n(fd, "points", 10)),
    expectedBehavior: s(fd, "expectedBehavior"),
    keywordGroups: JSON.stringify(parseKeywordText(s(fd, "keywords"))),
    active: fd.get("active") === "on",
  };
}

export async function saveBugAction(siteId: string, bugId: string, fd: FormData) {
  const staff = await requireCapability("content");
  const path = `/admin/content/${siteId}`;
  const data = bugData(fd);
  if (!data.title) back(path, "A bug needs a title.", "error");
  if (bugId === "new") {
    const site = await db.practiceWebsite.findUniqueOrThrow({ where: { id: siteId }, select: { version: true } });
    const code = data.code || `BUG-${String((await db.bugRegistryItem.count({ where: { websiteId: siteId, version: site.version } })) + 1).padStart(2, "0")}`;
    if (await db.bugRegistryItem.findFirst({ where: { websiteId: siteId, version: site.version, code } })) back(path, `The code ${code} is already used in this version.`, "error");
    const bug = await db.bugRegistryItem.create({ data: { ...data, code, websiteId: siteId, version: site.version } });
    await audit(staff.id, "bug_created", "BugRegistryItem", bug.id);
  } else {
    const { code: _code, ...rest } = data;
    void _code;
    await db.bugRegistryItem.update({ where: { id: bugId }, data: rest });
    await audit(staff.id, "bug_updated", "BugRegistryItem", bugId);
  }
  back(path, "Registry saved.");
}

export async function deleteBugAction(siteId: string, bugId: string) {
  const staff = await requireCapability("content");
  const used = await db.bugReport.count({ where: { matchedBugId: bugId } });
  if (used > 0) {
    await db.bugRegistryItem.update({ where: { id: bugId }, data: { active: false } });
    await audit(staff.id, "bug_deactivated", "BugRegistryItem", bugId);
    back(`/admin/content/${siteId}`, "This bug is referenced by learner reports, so it was deactivated instead of deleted.");
  }
  await db.bugRegistryItem.delete({ where: { id: bugId } });
  await audit(staff.id, "bug_deleted", "BugRegistryItem", bugId);
  back(`/admin/content/${siteId}`, "Bug deleted.");
}

/** Copies the active registry into a new version so existing attempts keep the answer key they were scored against. */
export async function newVersionAction(siteId: string) {
  const staff = await requireCapability("content");
  const site = await db.practiceWebsite.findUniqueOrThrow({ where: { id: siteId } });
  const bugs = await db.bugRegistryItem.findMany({ where: { websiteId: siteId, version: site.version, active: true } });
  const next = site.version + 1;
  await db.$transaction([
    ...bugs.map((b) => {
      const { id: _id, ...rest } = b;
      void _id;
      return db.bugRegistryItem.create({ data: { ...rest, version: next } });
    }),
    db.practiceWebsite.update({ where: { id: siteId }, data: { version: next } }),
  ]);
  await audit(staff.id, "website_version_created", "PracticeWebsite", siteId, { version: next });
  back(`/admin/content/${siteId}`, `Version ${next} created. New attempts use it; existing attempts keep version ${site.version}.`);
}

/* ───────────── Articles ───────────── */

export async function saveArticleAction(id: string, fd: FormData) {
  const staff = await requireCapability("content");
  const title = s(fd, "title");
  const category = s(fd, "category");
  if (!title || !LEARN_CATEGORIES.some((c) => c.slug === category)) back(id === "new" ? "/admin/articles/new" : `/admin/articles/${id}`, "Enter a title and choose a category.", "error");
  const status = s(fd, "status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const body = (typeof fd.get("body") === "string" ? (fd.get("body") as string) : "").trim();
  if (status === "PUBLISHED" && body.length < 50) back(id === "new" ? "/admin/articles/new" : `/admin/articles/${id}`, "Write the article body before publishing.", "error");
  const data = {
    title,
    category,
    summary: s(fd, "summary"),
    body,
    status,
    related: JSON.stringify(s(fd, "related").split(",").map((x) => x.trim()).filter(Boolean)),
  };
  if (id === "new") {
    const slug = slugify(s(fd, "slug") || title);
    if (await db.article.findUnique({ where: { slug } })) back("/admin/articles/new", "That URL slug is already used.", "error");
    const a = await db.article.create({ data: { ...data, slug, publishedAt: status === "PUBLISHED" ? new Date() : null, order: await db.article.count() } });
    await audit(staff.id, "article_created", "Article", a.id);
    redirect(`/admin/articles/${a.id}?ok=${encodeURIComponent("Article created.")}`);
  }
  const prev = await db.article.findUniqueOrThrow({ where: { id } });
  await db.article.update({ where: { id }, data: { ...data, publishedAt: status === "PUBLISHED" ? (prev.publishedAt ?? new Date()) : null } });
  await audit(staff.id, "article_updated", "Article", id, { status });
  revalidatePath("/learn");
  back(`/admin/articles/${id}`, "Article saved.");
}
