"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { makeT, type Locale, type TFn } from "./index";
import { am } from "./am";

const Ctx = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);

/** Translate in a client component: `const t = useT(); t("Learn")`. */
export function useT(): TFn {
  const locale = useContext(Ctx);
  return useMemo(() => makeT(locale, am), [locale]);
}
