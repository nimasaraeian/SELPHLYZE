"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

export default function Onboarding({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "AI-Powered Psychological Analysis",
      desc: "Selphlyze helps you understand your patterns, emotions, and behavior with AI.",
    },
    {
      title: "Take Your First Test",
      desc: "Start with a free quick test. It takes 2–3 minutes and gives instant insights.",
    },
    {
      title: "Get Results & Next Steps",
      desc: "Receive a concise snapshot plus recommendations. Upgrade for deeper modules anytime.",
    },
  ];
  const isLast = step === steps.length - 1;
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/70 grid place-items-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-white font-semibold">Welcome to Selphlyze</h3>
              <button onClick={onClose} className="text-[var(--muted)] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${i <= step ? 'bg-teal-500' : 'bg-[var(--border)]'}`}
                    style={{ width: `${100 / steps.length}%` }}
                  />
                ))}
              </div>
              <div className="mb-6">
                <div className="text-xl font-bold text-white mb-2">{steps[step].title}</div>
                <p className="text-[var(--muted)]">{steps[step].desc}</p>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={onClose} className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:bg-black/5">Skip</button>
                <button onClick={() => (isLast ? onClose() : setStep(step + 1))} className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white inline-flex items-center gap-2">
                  {isLast ? (<><CheckCircle2 className="w-4 h-4" /> Done</>) : (<><span>Next</span> <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


