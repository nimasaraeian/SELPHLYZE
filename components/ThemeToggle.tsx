"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors border-white/20 bg-black/20 text-gray-200 hover:bg-white/10 data-[theme=light]:border-black/20 data-[theme=light]:bg-white/60 data-[theme=light]:text-gray-700"
      data-theme={isDark ? "dark" : "light"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}


