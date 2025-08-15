"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  try {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    if (stored === "light" || stored === "dark") return stored;
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
  } catch {}
  return "light"; // default to light as requested
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    // Sync with system preference changes when user has not explicitly chosen
    const listener = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    if (mql && mql.addEventListener) mql.addEventListener("change", listener);
    return () => {
      if (mql && mql.removeEventListener) mql.removeEventListener("change", listener);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


