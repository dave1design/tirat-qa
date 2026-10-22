import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, makeT, type Locale } from "./index";
import { am } from "./am";

export const getLocale = cache(async (): Promise<Locale> => {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
});

/** Translate on the server: `const t = await getT(); t("Learn")`. */
export async function getT() {
  const locale = await getLocale();
  return makeT(locale, am);
}
