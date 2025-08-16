"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";

export default function FeedbackModal({ open, context, onClose }: { open: boolean; context?: string; onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const stars = [1,2,3,4,5];
  const submit = async () => {
    if (rating < 1) return;
    try {
      setSubmitting(true);
      await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, comment, context }) });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/70 grid place-items-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-white font-semibold">How was your experience?</h3>
              <button onClick={onClose} className="text-[var(--muted)] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                {stars.map((s) => (
                  <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="p-1">
                    <Star className={`w-7 h-7 ${ (hover || rating) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500' }`} />
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Optional feedback" rows={3} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-teal-500 focus:outline-none" />
              <div className="mt-4 flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:bg-black/5">Skip</button>
                <button disabled={submitting || rating < 1} onClick={submit} className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white disabled:opacity-50">Submit</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



















