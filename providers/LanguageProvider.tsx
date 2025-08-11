"use client";

import * as React from "react";

export type AppLanguage = "en" | "fa" | "es";
const FORCE_ENGLISH = true;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isRtl: boolean;
};

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<AppLanguage>("en");

  const setLanguage = (lang: AppLanguage) => {
    if (FORCE_ENGLISH) {
      setLanguageState("en");
    } else {
      setLanguageState(lang);
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("globalLanguage", FORCE_ENGLISH ? "en" : lang);
      } catch {}
    }
  };

  React.useEffect(() => {
    if (FORCE_ENGLISH) {
      setLanguageState("en");
      if (typeof window !== "undefined") {
        try { localStorage.setItem("globalLanguage", "en"); } catch {}
      }
      return;
    }
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

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const isRtl = React.useMemo(() => language === "fa", [language]);

  const value: LanguageContextValue = React.useMemo(() => ({ language, setLanguage, isRtl }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function normalizeToAppLanguage(input: string): AppLanguage {
  if (FORCE_ENGLISH) return "en";
  return input === "fa" ? "fa" : input === "es" ? "es" : "en";
}