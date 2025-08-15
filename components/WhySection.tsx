"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Sparkles, Trophy } from "lucide-react";

export default function WhySection() {
  const items = [
    { icon: Brain, title: "AI accuracy, human clarity", desc: "Actionable insights powered by advanced language models and psychology frameworks." },
    { icon: Sparkles, title: "Start free, upgrade anytime", desc: "Quick free snapshots, premium deep-dives when you're ready." },
    { icon: Shield, title: "Privacy-first", desc: "Responsible data handling and user control at every step." },
    { icon: Trophy, title: "Better than generic quizzes", desc: "Tailored prompts, multilingual guidance, and growth-oriented suggestions." },
  ];
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why Selphlyze?</h2>
          <p className="text-slate-300 mt-2">Clear value, transparent model: Start free. Upgrade for more depth.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-3">
                <it.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">{it.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


