import type { AmLevel } from "./types";
import { am1 } from "./level1";
import { am2 } from "./level2";
import { am3 } from "./level3";
import { am4 } from "./level4";
import { am5 } from "./level5";
import { am6 } from "./level6";
import { am7 } from "./level7";
import { am8 } from "./level8";

/** Amharic curriculum text keyed by level number. A level without an entry is shown in English. */
export const AM_LEVELS: Record<number, AmLevel> = { 1: am1, 2: am2, 3: am3, 4: am4, 5: am5, 6: am6, 7: am7, 8: am8 };
