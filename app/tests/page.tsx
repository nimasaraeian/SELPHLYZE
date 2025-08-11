"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { testCategories } from "../../data/tests";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TestsPage() {
  const router = useRouter();

  // Category icons mapping
  const getCategoryIcon = (categoryTitle: string) => {
    if (categoryTitle.includes("Core Personality")) return "🧠";
    if (categoryTitle.includes("Lifestyle & Sensory")) return "🎨";
    if (categoryTitle.includes("Professional & Decision")) return "💼";
    if (categoryTitle.includes("Relationships & Social")) return "❤️";
    if (categoryTitle.includes("Health & Emotional")) return "🧘";
    if (categoryTitle.includes("Behavioral & Communication")) return "🎭";
    if (categoryTitle.includes("Consumer & Media")) return "🛍️";
    if (categoryTitle.includes("Memory & Cognitive")) return "🧠";
    return "🔬";
  };

  const startTest = (testUrl: string) => {
    router.push(testUrl);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-20 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Explore Our AI-Powered Tests
        </h1>

        {testCategories.map((cat, index) => (
          <section key={index} className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-teal-300">
              {cat.category}
            </h2>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {cat.tests.map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-teal-400/60 shadow-xl hover:shadow-teal-500/20 transition-all duration-500 hover:scale-[1.02] flex flex-col"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={test.image}
                      alt={test.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={idx < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex flex-col h-full">
                    {/* Category Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl">{getCategoryIcon(cat.category)}</div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-teal-300 transition-colors text-center leading-tight">
                      {test.title}
                    </h3>

                    <p className="text-gray-400 group-hover:text-gray-300 mb-6 text-sm leading-relaxed text-center flex-grow">
                      {test.description}
                    </p>

                    <button
                      onClick={() =>
                        startTest(
                          `/tests/${test.title
                            .toLowerCase()
                            .replace(/ /g, "-")
                            .replace(/[^\w-]+/g, "")}`
                        )
                      }
                      className="mt-auto w-full py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:from-teal-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-teal-500/25"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Test
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>


    </main>
  );
}
