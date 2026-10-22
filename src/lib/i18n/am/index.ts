import type { Dict } from "../index";
import { layout } from "./layout";
import { home } from "./home";
import { about } from "./about";
import { learn } from "./learn";
import { lab } from "./lab";
import { auth } from "./auth";

/** English source text to Amharic. Add a new area by creating a file here and spreading it below. */
export const am: Dict = {
  ...layout,
  ...home,
  ...about,
  ...learn,
  ...lab,
  ...auth,
};
