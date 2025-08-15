"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Headphones, 
  FileText,
  ArrowRight
} from 'lucide-react';

export default function LearningCenter() {
  const cards = [
    {
      title: "Articles",
      href: "/psychology",
      icon: FileText,
      cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center&auto=format&q=80",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-600",
      description: "Scientific research & insights"
    },
    {
      title: "Books",
      href: "/books", 
      icon: BookOpen,
      cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop&crop=center&auto=format&q=80",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconBg: "bg-green-600",
      description: "Curated psychology library"
    },
    {
      title: "Podcasts",
      href: "/podcasts",
      icon: Headphones,
      cover: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop&crop=center&auto=format&q=80",
      gradient: "from-purple-500 to-pink-600", 
      bgGradient: "from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-600",
      description: "Audio learning on the go"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
          >
            Learning Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-[var(--muted)] max-w-3xl mx-auto"
          >
            Choose your learning path
          </motion.p>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
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
                  <div className="relative overflow-hidden rounded-3xl h-[420px] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    {/* Cover Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={card.cover} 
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                      
                      {/* Icon Overlay */}
                      <div className="absolute top-4 right-4">
                        <motion.div 
                          className={`p-3 rounded-xl ${card.iconBg} shadow-lg backdrop-blur-sm bg-opacity-90`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>

                      {/* Bottom Fade */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="p-6 h-40 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                          {card.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <motion.div
                        className="flex items-center justify-between mt-4"
                        initial={{ y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className={`text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          Explore Now
                        </span>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
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
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-[var(--muted)] text-lg">Research Topics</div>
          </div>
          <div className="text-center p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
            <div className="text-[var(--muted)] text-lg">Psychology Books</div>
          </div>
          <div className="text-center p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="text-4xl font-bold text-purple-600 mb-2">13</div>
            <div className="text-[var(--muted)] text-lg">Podcast Categories</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}