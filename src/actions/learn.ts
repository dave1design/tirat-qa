"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { findLesson } from "@/content/curriculum";
import { getLocale } from "@/lib/i18n/server";
import { canOpenLevel } from "@/lib/learn-access";

/** Pass mark for a subsection quiz: 4 out of 5 (80%). */
const QUIZ_PASS = 4;

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  saved: boolean;
  results: { correct: boolean; correctIndex: number; explanation: string }[];
  best: number | null;
}

/** Scores a quiz against the author key. The key never leaves the server until the learner has submitted. */
export async function submitQuizAction(levelN: number, lessonSlug: string, answers: (number | null)[]): Promise<QuizResult | null> {
  const found = findLesson(levelN, lessonSlug, await getLocale());
  if (!found || !Array.isArray(answers)) return null;
  const { lesson } = found;
  if (!(await canOpenLevel(await getCurrentUser(), levelN))) return null; // advanced levels need the one-time payment

  const results = lesson.quiz.map((question, i) => ({
    correct: answers[i] === question.a,
    correctIndex: question.a,
    explanation: question.e,
  }));
  const score = results.filter((r) => r.correct).length;

  let saved = false;
  let best: number | null = score;
  const user = await getCurrentUser();
  if (user) {
    const lessonKey = `${levelN}/${lessonSlug}`;
    const prev = await db.lessonProgress.findUnique({ where: { userId_lessonKey: { userId: user.id, lessonKey } } });
    best = Math.max(prev?.bestScore ?? 0, score);
    await db.lessonProgress.upsert({
      where: { userId_lessonKey: { userId: user.id, lessonKey } },
      create: { userId: user.id, lessonKey, attempts: 1, lastScore: score, bestScore: score },
      update: { attempts: { increment: 1 }, lastScore: score, bestScore: best },
    });
    saved = true;
  }
  return { score, total: lesson.quiz.length, passed: score >= QUIZ_PASS, saved, results, best };
}

export interface LabResult {
  score: number;
  total: number;
  items: { correct: boolean; answer: number }[];
  takeaway: string;
}

/** Rule-based lab feedback. The answers stay on the server, and this is not an AI grade. */
export async function checkLabAction(levelN: number, lessonSlug: string, answers: (number | null)[]): Promise<LabResult | null> {
  const found = findLesson(levelN, lessonSlug, await getLocale());
  if (!found || !Array.isArray(answers)) return null;
  const { lab } = found.lesson;
  const items = lab.items.map((it, i) => ({ correct: answers[i] === it.c, answer: it.c }));
  return { score: items.filter((i) => i.correct).length, total: items.length, items, takeaway: lab.takeaway };
}

export async function saveReflectionAction(levelN: number, lessonSlug: string, text: string): Promise<{ ok: boolean; message: string }> {
  const found = findLesson(levelN, lessonSlug);
  if (!found) return { ok: false, message: "Lesson not found." };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sign in to save your lab result and reflection." };
  if (!(await canOpenLevel(user, levelN))) return { ok: false, message: "Levels 5 to 8 need the one-time payment." };
  const reflection = String(text ?? "").trim().slice(0, 2000);
  if (reflection.length < 10) return { ok: false, message: "Write a short reflection (at least a sentence) to complete the lab." };
  const lessonKey = `${levelN}/${lessonSlug}`;
  await db.lessonProgress.upsert({
    where: { userId_lessonKey: { userId: user.id, lessonKey } },
    create: { userId: user.id, lessonKey, labDone: true, reflection },
    update: { labDone: true, reflection },
  });
  return { ok: true, message: "Lab complete. Your reflection is saved." };
}
