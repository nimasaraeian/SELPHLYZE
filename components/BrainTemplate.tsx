"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Section {
  title: string;
  value: string;
  color: string;
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

interface AnalysisData {
  sections: Section[];
  summary: string[];
}

export default function BrainTemplate() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const answers = JSON.parse(localStorage.getItem("testAnswers") || "{}");
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) return;
        const data = await res.json();
        setTimeout(() => setAnalysis(data), 3500); // شبیه‌سازی تاخیر تحلیل
      } catch (err) {
        console.error("Error fetching analysis:", err);
      }
    };
    getData();
  }, []);

  // ---------- صفحه انتظار ----------
  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-800 text-white">
        {/* انیمیشن مغز */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-44 h-44 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_60px_rgba(0,255,255,0.6)]"
        >
          <span className="text-6xl">🧠</span>
        </motion.div>

        {/* متن انتظار */}
        <motion.h2
          className="mt-10 text-3xl font-extrabold tracking-wide text-cyan-200 drop-shadow-lg"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Your Personality Analysis...
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-72 bg-white/20 rounded-full h-3 mt-8 overflow-hidden shadow-lg">
          <motion.div
            className="bg-cyan-400 h-3"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  // ---------- موقعیت کارت‌های مغز ----------
  const getPositionClasses = (position: string) => {
    const base = "absolute flex items-center space-x-3";
    switch (position) {
      case "topLeft": return `${base} top-12 left-0`;
      case "topRight": return `${base} top-12 right-0`;
      case "bottomLeft": return `${base} bottom-12 left-0`;
      case "bottomRight": return `${base} bottom-12 right-0`;
      default: return "";
    }
  };

  // ---------- صفحه اصلی تحلیل ----------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-800 p-8">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 max-w-6xl w-full grid md:grid-cols-2 gap-10 border border-white/20">
        
        {/* تصویر مغز */}
        <div className="relative flex items-center justify-center">
          <Image
            src="/image/brain.png"
            alt="Brain"
            width={480}
            height={480}
            className="drop-shadow-[0_0_30px_rgba(0,255,255,0.7)]"
          />

          {analysis.sections.map((section, i) => (
            <div key={i} className={getPositionClasses(section.position)}>
              {section.position.includes("Left") && (
                <div className="w-12 h-[3px] bg-cyan-400 shadow-[0_0_10px_cyan]"></div>
              )}
              <div
                className="bg-white/20 backdrop-blur-md p-5 rounded-xl shadow-lg border border-cyan-400 text-center min-w-[150px] hover:scale-[1.05] transition-transform"
              >
                <h3 className="font-extrabold text-cyan-200 text-lg drop-shadow-lg">
                  {section.title}
                </h3>
                <p className="text-base text-white font-bold">{section.value}</p>
              </div>
              {section.position.includes("Right") && (
                <div className="w-12 h-[3px] bg-cyan-400 shadow-[0_0_10px_cyan]"></div>
              )}
            </div>
          ))}
        </div>

        {/* خلاصه تحلیل */}
        <div>
          <h2 className="text-4xl font-extrabold text-cyan-200 mb-6 drop-shadow-lg">
            Your Personality Analysis
          </h2>
          <div className="space-y-5">
            {analysis.summary.map((line, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-indigo-700/70 to-purple-700/70 text-white p-5 rounded-2xl shadow-xl border border-white/30 hover:scale-[1.02] transition-transform"
              >
                <p className="font-semibold text-lg">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
