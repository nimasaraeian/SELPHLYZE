"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import SimpleAISearch from "@/components/SimpleAISearch";



export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      {/* Simple Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                SELPHLYZE
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                AI-Powered Psychology Platform
              </p>
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
          </div>
        </section>


      </main>
    </div>
  );
}
