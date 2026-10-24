/**
 * Testing helper: with QUIZ_ANSWER_FIRST=1 in .env, every lesson quiz and level exam shows the correct answer first (A).
 * It only works outside production builds, so it can never make the real quizzes easy by accident.
 */
export const ANSWER_FIRST = process.env.NODE_ENV !== "production" && process.env.QUIZ_ANSWER_FIRST === "1";

/** Moves the correct option(s) to the front and rewrites the key to match. */
export function answerFirst(o: string[], a: number[]): { o: string[]; a: number[] } {
  const key = [...a].sort((x, y) => x - y);
  const rest = o.map((_, i) => i).filter((i) => !key.includes(i));
  const order = [...key, ...rest];
  return { o: order.map((i) => o[i]), a: key.map((_, i) => i) };
}
