"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function TestsPage() {
  const cards = [
    {
      title: "Micro Tests",
      href: "/tests/micro",
      icon: Zap,
      cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center&auto=format&q=80",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconBg: "bg-orange-600",
      description: "Quick 2-5 minute psychological insights"
    },
    {
      title: "Deep Tests",
      href: "/modules", 
      icon: Brain,
      cover: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop&crop=center&auto=format&q=80",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-600",
      description: "Comprehensive psychological modules"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      <div className="max-w-5xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Psychological Tests
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-[var(--muted)] max-w-3xl mx-auto"
          >
            Choose your testing approach
          </motion.p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Link href={card.href}>
                  <div className="relative overflow-hidden rounded-3xl h-[460px] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    {/* Cover Image */}
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={card.cover} 
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                      
                      {/* Icon Overlay */}
                      <div className="absolute top-6 right-6">
                        <motion.div 
                          className={`p-4 rounded-xl ${card.iconBg} shadow-lg backdrop-blur-sm bg-opacity-90`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>

                      {/* Bottom Fade */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8 h-48 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                          {card.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <motion.div
                        className="flex items-center justify-between mt-6"
                        initial={{ y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className={`text-lg font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          Start Testing
                        </span>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="text-5xl font-bold text-orange-600 mb-3">25+</div>
            <div className="text-[var(--muted)] text-xl">Quick Micro Tests</div>
            <div className="text-[var(--muted)] text-sm mt-2">2-5 minutes each</div>
          </div>
          <div className="text-center p-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="text-5xl font-bold text-indigo-600 mb-3">8</div>
            <div className="text-[var(--muted)] text-xl">Deep Test Modules</div>
            <div className="text-[var(--muted)] text-sm mt-2">15-30 minutes each</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}