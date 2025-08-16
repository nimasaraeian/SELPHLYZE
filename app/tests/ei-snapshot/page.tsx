"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FeedbackModal from "@/components/FeedbackModal";

const Q = [
  "When a friend is upset, what do you do first?",
  "What best describes your listening style?",
  "How do you respond to criticism?",
];
const OPT = [
  ["Ask what happened", "Offer comfort", "Give space"],
  ["Reflect and clarify", "Listen silently", "Share similar experiences"],
  ["Look for truth in it", "Defend my view", "Delay response"],
];

export default function EISnapshot() {
  const [a, setA] = useState<Record<number, number>>({});
  const [showFb, setShowFb] = useState(false);
  const router = useRouter();
  const submit = async () => { setShowFb(true); };
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-6">Your Emotional Intelligence Snapshot</h1>
        <p className="text-slate-300 mb-8">A quick pulse across empathy, regulation, and self-awareness.</p>
        <div className="space-y-6">
          {Q.map((q, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700">
              <div className="text-white font-medium mb-3">{q}</div>
              <div className="grid sm:grid-cols-3 gap-2">
                {OPT[i].map((t, j) => (
                  <button key={j} onClick={() => setA({ ...a, [i]: j })} className={`px-3 py-2 rounded-lg border ${a[i]===j ? 'bg-teal-600 text-white border-teal-400' : 'bg-slate-900/50 text-slate-200 border-slate-700'}`}>{t}</button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button disabled={Object.keys(a).length < Q.length} onClick={submit} className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white disabled:opacity-50">See Snapshot</button>
          <button onClick={() => router.push('/tests')} className="px-5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">Back</button>
        </div>
      </div>
      <FeedbackModal open={showFb} context="test:ei-snapshot" onClose={() => { setShowFb(false); router.push('/profile'); }} />
    </main>
  );
}


















