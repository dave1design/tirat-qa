export type Locale = "en" | "am";
export const LOCALES: Locale[] = ["en", "am"];
export const LOCALE_COOKIE = "tirat_lang";
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: unknown): v is Locale => v === "en" || v === "am";

export type Dict = Record<string, string>;
export type TFn = ((en: string, vars?: Record<string, string | number>) => string) & { locale: Locale };

/**
 * Translation by English source text. In English the text is returned unchanged; in Amharic the dictionary is
 * consulted and any text without a translation falls back to English, so the page never breaks. `{name}` tokens are
 * replaced from `vars` in both languages.
 */
export function makeT(locale: Locale, dict: Dict): TFn {
  const t = ((en: string, vars?: Record<string, string | number>) => {
    const text = locale === "am" ? (dict[en] ?? en) : en;
    return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
  }) as TFn;
  t.locale = locale;
  return t;
}

/** "1 website" / "3 websites" in English; Amharic uses the same word for one and many ("3 ድረ-ገጽ"). */
export function countLabel(t: TFn, n: number, one: string, many = `${one}s`) {
  return t.locale === "am" ? `${n} ${t(one)}` : `${n} ${n === 1 ? one : many}`;
}
