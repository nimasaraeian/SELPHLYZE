"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Users, 
  Shield, 
  Globe,
  ArrowDown,
  Star,
  Zap,
  Target
} from "lucide-react";
import SimpleAISearch from "@/components/SimpleAISearch";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced psychological insights with cutting-edge AI",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Expert Therapists",
    description: "Connect with verified professionals worldwide",
    gradient: "from-teal-500 to-blue-500"
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    description: "Your mental health journey stays confidential",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Available in 15+ languages for global reach",
    gradient: "from-green-500 to-teal-500"
  }
];

const stats = [
  { number: "50K+", label: "Users Helped", icon: Users },
  { number: "95%", label: "Satisfaction Rate", icon: Star },
  { number: "24/7", label: "AI Availability", icon: Zap },
  { number: "15+", label: "Languages", icon: Globe }
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effects
  const logoY = useTransform(scrollY, [0, 500], [0, -150]);
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </motion.div>

      {/* Interactive Mouse Follow Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(20, 184, 166, 0.15), transparent 40%)`
        }}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="container max-w-6xl mx-auto">
            
            {/* Logo with Advanced Animations */}
            <motion.div 
              style={{ y: logoY }}
              className="mb-12 relative flex justify-center"
            >
              {/* Multi-layer Glow Effects */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 blur-3xl opacity-30"
              />
              
              <motion.div 
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 blur-2xl opacity-20"
              />

              {/* Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  duration: 1.5 
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
                className="relative z-10"
              >
                <Image
                  src="/image/SELPHLYZE_LOGO.png"
                  alt="Selphlyze Logo"
                  width={320}
                  height={320}
                  className="mx-auto drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              style={{ y: titleY }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-8"
            >
              <motion.h1 
                className="text-responsive-xl font-extrabold mb-6 text-gradient-psyche leading-tight"
                whileHover={{ scale: 1.02 }}
              >
                Discover Your Mind
                <br />
                <span className="text-gradient-cosmic">Transform Your Life</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed"
              >
                Experience the future of psychology with AI-powered insights, 
                expert guidance, and personalized mental health solutions
              </motion.p>
            </motion.div>

            {/* AI Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mb-16"
            >
              <SimpleAISearch />
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-400/30 mb-4 group-hover:border-teal-400/60 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="flex flex-col items-center"
            >
              <p className="text-gray-500 text-sm mb-4">Explore Our Features</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-full border border-gray-600 hover:border-teal-400 transition-colors cursor-pointer"
              >
                <ArrowDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-psyche mb-6">
                Why Choose Selphlyze?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Cutting-edge technology meets compassionate care to revolutionize your mental health journey
              </p>
            </motion.div>

            <div className="grid-cards">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card-modern group cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-teal-400 font-medium group-hover:text-teal-300 transition-colors">
                    <span>Learn More</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Target className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="fixed bottom-8 right-8 glass-dark rounded-2xl p-4 z-20"
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full"
              />
              <span className="text-gray-300">AI Assistant Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-gray-300">Multi-language Support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full" />
              <span className="text-gray-300">24/7 Available</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
