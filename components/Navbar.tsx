"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  TestTube, 
  Users, 
  User, 
  Mail,
  Sparkles,
  ChevronDown,
  Headphones,
  BookOpen
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tests", href: "/tests", icon: TestTube },
  { name: "Articles", href: "/psy-articles", icon: Brain },
  { name: "Modules", href: "/modules", icon: Sparkles },
  { name: "Therapists", href: "/therapists", icon: Users },
  { name: "Podcasts", href: "/podcasts", icon: Headphones },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Centered Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full fixed top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "glass-dark shadow-2xl py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Centered Navigation */}
          <div className="flex justify-center items-center">
            <div className="hidden md:flex items-center bg-black/20 backdrop-blur-md rounded-full border border-white/10 px-8 py-4 gap-8">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        relative px-4 py-2 rounded-full font-medium text-base
                        transition-all duration-300 group flex items-center gap-2
                        ${isActive 
                          ? "text-white bg-gradient-to-r from-teal-500 to-blue-500" 
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="hidden lg:block">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-dark border-l border-white/20 z-50 lg:hidden"
            >
              <div className="p-6">
                
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient-psyche">
                      SELPHLYZE
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-4 px-4 py-4 rounded-xl font-medium
                            transition-all duration-300 group
                            ${isActive 
                              ? "text-white bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 border border-teal-400/30" 
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                            }
                          `}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-lg">{item.name}</span>
                          
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-2 h-2 bg-teal-400 rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 text-center">
                    AI-Powered Psychology Platform
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">AI Assistant Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
