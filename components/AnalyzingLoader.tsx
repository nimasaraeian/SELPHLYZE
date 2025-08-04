"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AnalyzingLoader() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
      ></motion.div>
      <p className="mt-6 text-lg font-semibold text-gray-700">
        Analyzing your responses{dots}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        This may take a few seconds
      </p>
    </div>
  );
}
