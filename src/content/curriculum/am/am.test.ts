import { describe, expect, it } from "vitest";
import { LEVELS } from "../index";
import { AM_LEVELS } from "./index";

describe("Amharic curriculum", () => {
  for (const [n, am] of Object.entries(AM_LEVELS)) {
    const en = LEVELS.find((l) => l.n === Number(n))!;
    it(`level ${n} matches the English structure`, () => {
      expect(en).toBeTruthy();
      expect(am.interview).toHaveLength(en.interview.length);
      expect(am.lessons).toHaveLength(en.lessons.length);
      am.lessons.forEach((a, i) => {
        const e = en.lessons[i];
        expect(a.objectives, e.slug).toHaveLength(e.objectives.length);
        expect(a.diagram.boxes, e.slug).toHaveLength(e.diagram.boxes.length);
        expect(a.lab.categories, e.slug).toHaveLength(e.lab.categories.length);
        expect(a.lab.items, e.slug).toHaveLength(e.lab.items.length);
        expect(a.quiz, e.slug).toHaveLength(e.quiz.length);
        for (const q of a.quiz) expect(q.o).toHaveLength(4);
        for (const s of [a.title, a.notes, a.example, a.video.summary]) expect(s.length).toBeGreaterThan(10);
      });
    });
  }
});
