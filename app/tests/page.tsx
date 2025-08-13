"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { testCategories } from "../../data/tests";
import { motion } from "framer-motion";
import TestCard from "@/components/TestCard";

export default function TestsPage() {
  const router = useRouter();

  // Category icons removed per request for a cleaner visual design

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

            <div className="grid items-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {cat.tests.map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <TestCard
                    title={test.title}
                    description={test.description}
                    img={test.image}
                    href={`/tests/${test.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}`}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>


    </main>
  );
}
