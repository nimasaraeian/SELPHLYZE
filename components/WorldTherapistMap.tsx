"use client";

import { useMemo } from "react";

type Props = {
  selectedCountry: string | null;
  onSelect: (code: string) => void;
};

// Minimal, stylized world map (not geographic-accurate). Codes follow ISO-like strings.
export default function WorldTherapistMap({ selectedCountry, onSelect }: Props) {
  const countries = useMemo(
    () => [
      { code: "US", title: "United States", x: 120, y: 90, w: 90, h: 30 },
      { code: "CA", title: "Canada", x: 120, y: 50, w: 90, h: 30 },
      { code: "BR", title: "Brazil", x: 170, y: 150, w: 50, h: 28 },
      { code: "GB", title: "United Kingdom", x: 240, y: 85, w: 18, h: 14 },
      { code: "DE", title: "Germany", x: 260, y: 95, w: 22, h: 14 },
      { code: "IR", title: "Iran", x: 310, y: 110, w: 32, h: 16 },
      { code: "IN", title: "India", x: 350, y: 135, w: 36, h: 18 },
      { code: "ES", title: "Spain", x: 235, y: 115, w: 24, h: 14 },
      { code: "JP", title: "Japan", x: 460, y: 120, w: 16, h: 28 },
      { code: "AU", title: "Australia", x: 420, y: 190, w: 70, h: 28 },
    ],
    []
  );

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4">
      <div className="text-slate-300 text-sm mb-2">Select a country</div>
      <svg viewBox="0 0 520 260" className="w-full h-64">
        <rect x="0" y="0" width="520" height="260" rx="16" fill="#0b1220" />
        {/* Continents silhouettes (very rough) */}
        <g opacity="0.15" fill="#22d3ee">
          <ellipse cx="150" cy="120" rx="130" ry="70" />
          <ellipse cx="330" cy="120" rx="160" ry="80" />
          <ellipse cx="420" cy="210" rx="90" ry="45" />
        </g>
        {countries.map((c) => {
          const active = selectedCountry === c.code;
          return (
            <g key={c.code} cursor="pointer" onClick={() => onSelect(c.code)}>
              <rect
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                rx={6}
                fill={active ? "#14b8a6" : "#1f2937"}
                stroke={active ? "#34d399" : "#334155"}
                strokeWidth={active ? 3 : 1}
              />
              <text
                x={c.x + c.w / 2}
                y={c.y + c.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={active ? "#0b1220" : "#cbd5e1"}
                fontSize="10"
              >
                {c.code}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 text-xs text-slate-400">
        Highlighted by hover; click to select country. Codes are illustrative.
      </div>
    </div>
  );
}


















