"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { testCategories } from "../../data/tests";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import TestCard from "@/components/TestCard";

export default function TestsPage() {
  const router = useRouter();

  // Category icons removed per request for a cleaner visual design

  const startTest = (testUrl: string) => {
    router.push(testUrl);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-20 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Explore Our AI-Powered Tests
        </h1>

        {/* Free teaser tests */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            { slug: 'creativity-snapshot', title: 'Discover Your Creativity Style', desc: 'A 2-minute snapshot to reveal your creative tendencies.', img: '/image/AI-Powered Content Specialist.jpg' },
            { slug: 'ei-snapshot', title: 'Your Emotional Intelligence Snapshot', desc: 'Quickly gauge your EI across key dimensions.', img: '/image/EmotionalIntelligence.JPG' },
            { slug: 'hidden-traits', title: 'Find Your Hidden Personality Traits', desc: 'Short, intriguing cues to surface patterns you may miss.', img: '/image/habits.JPG' },
          ].map((t, i) => (
            <Link key={t.slug} href={`/tests/${t.slug}`} className="rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow hover:shadow-elevate transition group">
              <div className="relative h-40">
                <Image src={t.img} alt={t.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-[var(--foreground)] font-semibold mb-1">{t.title}</h3>
                <p className="text-[var(--muted)] text-sm mb-3">{t.desc}</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm">Start Test</span>
              </div>
            </Link>
          ))}
        </div>

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
