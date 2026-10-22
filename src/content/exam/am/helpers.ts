import type { AmExamQ } from "./index";

/** Amharic text for one exam question: the stem, the options in the English order, and the explanation. */
export const t = (q: string, o: string[], e: string): AmExamQ => ({ q, o, e });
