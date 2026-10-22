import { describe, expect, it } from "vitest";
import { LEVELS, TOTAL_LESSONS } from "./index";

describe("curriculum", () => {
  it("has 8 levels and 24 subsections", () => {
    expect(LEVELS).toHaveLength(8);
    expect(TOTAL_LESSONS).toBe(24);
    for (const l of LEVELS) expect(l.lessons).toHaveLength(3);
  });

  it("gives every lesson exactly five four-option questions with a valid key", () => {
    for (const l of LEVELS)
      for (const lesson of l.lessons) {
        expect(lesson.quiz, lesson.slug).toHaveLength(5);
        for (const qu of lesson.quiz) {
          expect(qu.o).toHaveLength(4);
          expect(qu.a).toBeGreaterThanOrEqual(0);
          expect(qu.a).toBeLessThanOrEqual(3);
          expect(qu.e.length).toBeGreaterThan(5);
        }
      }
  });

  it("has valid lab answers, video ids and unique slugs", () => {
    const slugs = new Set<string>();
    for (const l of LEVELS)
      for (const lesson of l.lessons) {
        expect(slugs.has(`${l.n}/${lesson.slug}`)).toBe(false);
        slugs.add(`${l.n}/${lesson.slug}`);
        expect(lesson.video.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
        for (const it of lesson.lab.items) {
          expect(it.c).toBeGreaterThanOrEqual(0);
          expect(it.c).toBeLessThan(lesson.lab.categories.length);
        }
        expect(lesson.lab.items.length).toBeGreaterThanOrEqual(4);
      }
  });

  it("gives each level five interview prompts", () => {
    for (const l of LEVELS) expect(l.interview).toHaveLength(5);
  });
});
