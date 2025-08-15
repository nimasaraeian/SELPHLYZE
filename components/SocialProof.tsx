"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Smile, TestTube } from "lucide-react";

export default function SocialProof() {
  const [tests, setTests] = useState<number>(0);
  const [positive, setPositive] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/metrics");
        const j = await res.json();
        setTests(j.tests || 0);
        setPositive(j.positive || 0);
      } catch {}
    })();
  }, []);
  const cards = [
    { icon: TestTube, label: "Tests Completed", value: tests.toLocaleString() },
    { icon: Smile, label: "Positive Feedback", value: `${positive}%` },
    { icon: Globe, label: "Global Reach", value: "Growing" },
  ];
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl p-5 bg-[var(--surface)] border border-[var(--border)] shadow flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-slate-300 text-sm">{c.label}</div>
                <div className="text-white text-xl font-bold">{c.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


