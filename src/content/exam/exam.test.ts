import { describe, expect, it } from "vitest";
import { examQuestions } from "./index";

describe("level exams", () => {
  for (let n = 1; n <= 8; n++) {
    it(`level ${n} has 25 single-answer and 25 multi-select questions`, () => {
      const qs = examQuestions(n)!;
      expect(qs).toHaveLength(50);
      const a = qs.filter((q) => q.part === "A");
      const b = qs.filter((q) => q.part === "B");
      expect(a).toHaveLength(25);
      expect(b).toHaveLength(25);
      for (const q of a) {
        expect(q.o).toHaveLength(4);
        expect(q.a).toHaveLength(1);
        expect(q.a[0]).toBeLessThan(4);
      }
      for (const q of b) {
        expect(q.o).toHaveLength(5);
        expect(q.a.length).toBeGreaterThanOrEqual(2);
        expect(Math.max(...q.a)).toBeLessThan(5);
        expect(new Set(q.a).size).toBe(q.a.length);
      }
      for (const q of qs) {
        expect([1, 2, 3]).toContain(q.l);
        expect(q.e.length).toBeGreaterThan(5);
        expect(new Set(q.o).size).toBe(q.o.length);
      }
    });
  }
});
