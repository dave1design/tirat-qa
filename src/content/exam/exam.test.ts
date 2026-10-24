import { describe, expect, it } from "vitest";
import { EXAM_PART_A, EXAM_PART_B, EXAM_PASS_POINTS, EXAM_TOTAL, examPoints, examQuestions } from "./index";

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

describe("exam attempt size and scoring", () => {
  it("draws 17 knowledge and 13 interview questions, 30 in all", () => {
    expect(EXAM_PART_A).toBe(17);
    expect(EXAM_PART_B).toBe(13);
    expect(EXAM_TOTAL).toBe(30);
  });

  it("scores out of 100 and passes at 24 of 30", () => {
    expect(examPoints(24, EXAM_TOTAL)).toBe(80);
    expect(examPoints(24, EXAM_TOTAL)).toBeGreaterThanOrEqual(EXAM_PASS_POINTS);
    expect(examPoints(23, EXAM_TOTAL)).toBeLessThan(EXAM_PASS_POINTS);
    expect(examPoints(30, EXAM_TOTAL)).toBe(100);
    expect(examPoints(0, 0)).toBe(0);
  });
});

