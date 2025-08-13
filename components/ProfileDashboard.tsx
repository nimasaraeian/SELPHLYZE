"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, BarChart2, PieChart } from "lucide-react";

type Result = { testName: string; score: number; date: string };

export default function ProfileDashboard({
  name,
  testResults = [],
  synclyzeScores,
}: {
  name?: string;
  testResults?: Result[];
  synclyzeScores?: { attachment: number; eq: number; conflict: number; empathy: number; language: number } | undefined;
}) {
  // Prepare data for simple charts
  const recent = (testResults || []).slice(0, 10);
  const areaData = (recent.length ? recent.map(r => r.score) : [22, 35, 18, 44, 39, 52, 31, 47, 29, 41]).map(v => Math.max(0, Math.min(100, v)));
  const maxY = 60; // visual max for area chart

  const width = 700;
  const height = 220;
  const paddingX = 24;
  const paddingY = 20;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const points = areaData.map((v, i) => {
    const x = paddingX + (i / Math.max(1, areaData.length - 1)) * innerW;
    const y = paddingY + innerH - (Math.min(v, maxY) / maxY) * innerH;
    return [x, y] as const;
  });
  const pathD = [
    `M ${paddingX} ${paddingY + innerH}`,
    points.map(([x, y]) => `L ${x} ${y}`).join(" "),
    `L ${paddingX + innerW} ${paddingY + innerH} Z`,
  ].join(" ");

  const barData = [
    { label: "TITLE A", v: 16 },
    { label: "TITLE B", v: 28 },
    { label: "TITLE C", v: 12 },
    { label: "TITLE D", v: 20 },
    { label: "TITLE E", v: 26 },
    { label: "TITLE F", v: 14 },
  ];

  const progress = [
    { day: "Monday", value: 72 },
    { day: "Tuesday", value: 56 },
    { day: "Wednesday", value: 81 },
    { day: "Thursday", value: 64 },
    { day: "Friday", value: 90 },
  ];

  const donuts = synclyzeScores
    ? [
        Math.round((synclyzeScores.attachment / 5) * 100),
        Math.round((synclyzeScores.eq / 5) * 100),
        Math.round((synclyzeScores.empathy / 5) * 100),
      ]
    : [75, 62, 43];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Infographic</h2>
            <p className="text-slate-300 text-sm">Element Collection · {name || "Guest"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search"
                className="pl-9 pr-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
            <button className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm">Search</button>
          </div>
        </div>
      </motion.div>

      {/* Reduced widgets per request */}
    </div>
  );
}



