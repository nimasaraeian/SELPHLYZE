"use client";
import { motion } from "framer-motion";

export default function InlineLoader({ text = "Analyzing your responses..." }) {
  return (
    <div className="flex justify-center items-center mt-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
      ></motion.div>
      <span className="ml-3 text-indigo-400 font-medium">{text}</span>
    </div>
  );
}
