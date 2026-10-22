"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { EXAM_BLUEPRINT_VERSION, examQuestions } from "@/content/exam";
import { buildOrder, finalizeAttempt, newExpiry } from "@/lib/exam";
import { getLevel } from "@/content/curriculum";

export async function startExamAction(levelN: number) {
  const user = await requireUser(`/learn/levels/${levelN}/exam`);
  if (!getLevel(levelN) || !examQuestions(levelN)) redirect("/learn");

  const open = await db.examAttempt.findFirst({ where: { userId: user.id, levelN, status: "IN_PROGRESS" }, orderBy: { startedAt: "desc" } });
  if (open && open.expiresAt.getTime() > Date.now()) redirect(`/learn/levels/${levelN}/exam`);
  if (open) await finalizeAttempt(open.id, true); // an expired attempt is closed and scored first

  await db.examAttempt.create({
    data: { userId: user.id, levelN, version: EXAM_BLUEPRINT_VERSION, expiresAt: newExpiry(), order: JSON.stringify(buildOrder(levelN)) },
  });
  redirect(`/learn/levels/${levelN}/exam`);
}

/** Autosave: stores one answer. Returns false once the attempt is closed or the time is up. */
export async function saveExamAnswerAction(attemptId: string, questionId: string, selection: number[]): Promise<boolean> {
  const user = await requireUser();
  const attempt = await db.examAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
  if (!attempt || attempt.status !== "IN_PROGRESS" || attempt.expiresAt.getTime() + 5_000 < Date.now()) return false;
  const q = examQuestions(attempt.levelN)?.find((x) => x.id === questionId);
  if (!q) return false;
  const clean = [...new Set(selection)].filter((n) => Number.isInteger(n) && n >= 0 && n < q.o.length);
  const responses = JSON.parse(attempt.responses) as Record<string, number[]>;
  responses[questionId] = q.part === "A" ? clean.slice(0, 1) : clean;
  await db.examAttempt.update({ where: { id: attempt.id }, data: { responses: JSON.stringify(responses) } });
  return true;
}

export async function submitExamAction(attemptId: string, timedOut = false) {
  const user = await requireUser();
  const attempt = await db.examAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
  if (!attempt) redirect("/learn");
  const expired = attempt.expiresAt.getTime() <= Date.now();
  await finalizeAttempt(attempt.id, timedOut || expired);
  redirect(`/learn/levels/${attempt.levelN}/exam/results/${attempt.id}`);
}
