"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import SimpleAISearch from "@/components/SimpleAISearch";
import WhySection from "@/components/WhySection";
import SocialProof from "@/components/SocialProof";
import { getVariant } from "@/utils/ab";
import { useUserTracking } from "@/hooks/useUserTracking";



export default function Home() {
  const variant = getVariant("home_headline");
  const { getUserFirstName, isLoggedIn } = useUserTracking();
  
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Simple Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl bg-teal-500/10" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl bg-blue-500/10" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="container max-w-6xl mx-auto">
            
            {/* Simple Logo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex justify-center"
            >
              <Image
                src="/image/SELPHLYZE_LOGO.png"
                alt="Selphlyze Logo"
                width={200}
                height={200}
                className="mx-auto"
                priority
              />
            </motion.div>

            {/* Simple Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-12"
            >
              {/* Keep subtitle, remove SELPHLYZE heading */}
              <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto">
                AI-Powered Psychology Platform
              </p>
            </motion.div>

            {/* AB-tested headline + CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }} className="mb-6">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                {variant === 'A' ? "Understand Yourself with AI" : "AI Insights for Your Mind"}
              </h1>
            </motion.div>

            {/* AI Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-16"
            >
              <SimpleAISearch />
            </motion.div>

            <WhySection />
            <SocialProof />
          </div>
        </section>


      </main>
      
    </div>
  );
}
