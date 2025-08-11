"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "@/utils/multilingual";

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("globalLanguage", lang);
      } catch {}
    }
  };

  // Initialize from localStorage or browser language
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("globalLanguage") as SupportedLanguage | null;
      if (saved) {
        setLanguageState(saved);
        return;
      }
      const browser = navigator.language.substring(0, 2) as SupportedLanguage;
      const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
      setLanguageState(supportedCodes.includes(browser) ? browser : "en");
    } catch {}
  }, []);

  // Update <html> lang only (do not change page direction)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = language;
  }, [language]);

  const isRtl = useMemo(() => language === "ar" || language === "fa", [language]);

  const value: LanguageContextValue = useMemo(() => ({ language, setLanguage, isRtl }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}


