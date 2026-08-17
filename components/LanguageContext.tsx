"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Translate = (value: string) => string;

const LanguageContext = createContext<Translate>((value) => value);

export function LanguageProvider({ translate, children }: { translate: Translate; children: ReactNode }) {
  return <LanguageContext.Provider value={translate}>{children}</LanguageContext.Provider>;
}

export const useTranslate = () => useContext(LanguageContext);
