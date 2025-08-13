"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "en" | "fa" | "es" | "tr" | "fr";
const FORCE_ENGLISH = false;

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  const setLanguage = (lang: AppLanguage) => {
    const next = FORCE_ENGLISH ? "en" : lang;
    setLanguageState(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("globalLanguage", next);
      } catch {}
    }
  };

  useEffect(() => {
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
      if (saved && ["en","fa","es","tr","fr"].includes(saved)) {
        setLanguageState(saved as AppLanguage);
        return;
      }
      const browser2 = navigator.language.substring(0, 2) as string;
      const normalized: AppLanguage = browser2 === "fa" ? "fa" : browser2 === "es" ? "es" : browser2 === "tr" ? "tr" : browser2 === "fr" ? "fr" : "en";
      setLanguageState(normalized);
    } catch {}
  }, []);

  // Keep layout LTR for all languages; only text changes per language
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = language;
    html.dir = "ltr";
  }, [language]);

  const isRtl = useMemo(() => false, [language]);

  const value: LanguageContextValue = useMemo(() => ({ language, setLanguage, isRtl }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function normalizeToAppLanguage(input: string): AppLanguage {
  if (FORCE_ENGLISH) return "en";
  switch (input) {
    case "fa": return "fa";
    case "es": return "es";
    case "tr": return "tr";
    case "fr": return "fr";
    default: return "en";
  }
}