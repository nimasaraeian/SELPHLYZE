"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "en" | "fa" | "es";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("globalLanguage", lang);
      } catch {}
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("globalLanguage") as AppLanguage | null;
      if (saved === "en" || saved === "fa" || saved === "es") {
        setLanguageState(saved);
        return;
      }
      const browser2 = navigator.language.substring(0, 2);
      const normalized: AppLanguage = browser2 === "fa" ? "fa" : browser2 === "es" ? "es" : "en";
      setLanguageState(normalized);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const isRtl = useMemo(() => language === "fa", [language]);

  const value: LanguageContextValue = useMemo(() => ({ language, setLanguage, isRtl }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function normalizeToAppLanguage(input: string): AppLanguage {
  return input === "fa" ? "fa" : input === "es" ? "es" : "en";
}