import { describe, expect, it } from "vitest";
import { examQuestions } from "../index";
import { AM_EXAMS } from "./index";

describe("Amharic exams", () => {
  for (const [n, am] of Object.entries(AM_EXAMS)) {
    it(`level ${n} matches the English exam`, () => {
      const en = examQuestions(Number(n))!;
      const a = en.filter((q) => q.part === "A");
      const b = en.filter((q) => q.part === "B");
      expect(am.partA).toHaveLength(a.length);
      expect(am.partB).toHaveLength(b.length);
      am.partA.forEach((t, i) => expect(t.o, `A${i + 1}`).toHaveLength(a[i].o.length));
      am.partB.forEach((t, i) => expect(t.o, `B${i + 1}`).toHaveLength(b[i].o.length));
    });
  }
});
