"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  Users, 
  Briefcase, 
  ShoppingCart, 
  UtensilsCrossed, 
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from "lucide-react";

const modules = [
  {
    id: "synclyze",
    name: "Synclyze",
    description: "Synchronize and analyze compatibility between partners, friends, or colleagues",
    icon: Users,
    image: "/image/emoconnectjpg.jpg", // از تصاویر موجود
    color: "from-pink-500 to-rose-600",
    features: ["Relationship Compatibility", "Communication Analysis", "Sync Sessions"],
    path: "/modules/synclyze"
  },
  {
    id: "shadowlyze",
    name: "Shadowlyze", 
    description: "Explore and analyze your shadow self, hidden patterns, and unconscious behaviors",
    icon: Brain,
    image: "/image/ShadowTrace.jpg", // از تصاویر موجود
    color: "from-purple-600 to-indigo-700",
    features: ["Shadow Self Analysis", "Hidden Patterns", "Unconscious Mapping"],
    path: "/modules/shadowlyze"
  },
  {
    id: "joblyze",
    name: "Joblyze",
    description: "Analyze career compatibility, workplace psychology, and professional development",
    icon: Briefcase,
    image: "/image/AI-Powered Content Specialist.jpg", // از تصاویر موجود
    color: "from-blue-500 to-cyan-600",
    features: ["Career Assessment", "Workplace Psychology", "Professional Growth"],
    path: "/modules/joblyze"
  },
  {
    id: "shoplyze",
    name: "Shoplyze",
    description: "Understand your shopping psychology, consumer behavior, and spending patterns",
    icon: ShoppingCart,
    image: "/image/neuromarketing.jpg", // از تصاویر موجود
    color: "from-emerald-500 to-teal-600",
    features: ["Shopping Psychology", "Consumer Behavior", "Spending Analysis"],
    path: "/modules/shoplyze"
  },
  {
    id: "foodlyze",
    name: "Foodlyze",
    description: "Analyze your relationship with food, eating patterns, and nutritional psychology",
    icon: UtensilsCrossed,
    image: "/image/habits.JPG", // از تصاویر موجود
    color: "from-orange-500 to-red-600",
    features: ["Food Psychology", "Eating Patterns", "Nutritional Mindset"],
    path: "/modules/foodlyze"
  },
  {
    id: "timelyze",
    name: "Timelyze",
    description: "Understand your time perception, productivity patterns, and temporal psychology",
    icon: Clock,
    image: "/image/ChronoForecast.jpg", // از تصاویر موجود
    color: "from-violet-500 to-purple-600",
    features: ["Time Perception", "Productivity Analysis", "Temporal Patterns"],
    path: "/modules/timelyze"
  }
];

export default function ModulesPage() {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            AI Psychology Modules
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover profound insights about yourself and others through our advanced AI-powered psychological analysis modules. 
            Each module is designed to unlock different aspects of human behavior and psychology.
          </p>
        </motion.header>

        {/* Modules Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onHoverStart={() => setHoveredModule(module.id)}
              onHoverEnd={() => setHoveredModule(null)}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-cyan-500/60 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700 hover:scale-[1.02]"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ backgroundImage: `url(${module.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/80 z-10" />
              
              {/* Content */}
              <div className="relative z-20 p-8 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <module.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mb-6 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {module.name}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
                    {module.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + idx * 0.1 }}
                        className="px-3 py-1 bg-slate-800/60 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-slate-600 group-hover:border-cyan-500/50 group-hover:text-cyan-300 transition-all duration-300"
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link href={module.path} className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r ${module.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-cyan-500/25 flex items-center justify-center gap-2`}
                  >
                    <span>Start Analysis</span>
                    <motion.div
                      animate={{ x: hoveredModule === module.id ? 4 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </Link>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    opacity: hoveredModule === module.id ? 1 : 0,
                    scale: hoveredModule === module.id ? 1 : 0.8 
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 z-30"
                >
                  <div className="w-8 h-8 bg-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                </motion.div>
              </div>

              {/* Glow Effect */}
              <motion.div
                animate={{ 
                  opacity: hoveredModule === module.id ? 0.6 : 0,
                  scale: hoveredModule === module.id ? 1.1 : 0.8 
                }}
                transition={{ duration: 0.5 }}
                className={`absolute -inset-1 bg-gradient-to-r ${module.color} rounded-3xl blur-xl -z-10`}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Each module uses advanced artificial intelligence to provide personalized psychological insights 
              and actionable recommendations based on your unique responses.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span>Personalized Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Real-time Results</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}