"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  Brain, 
  TestTube, 
  Users, 
  User,
  Sparkles,
  ChevronDown,
  GraduationCap,
  LogOut,
  Settings,
  ExternalLink
} from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "AI", href: "/", icon: Brain },
  { name: "Social", href: "/social", icon: Users },
  { name: "Tests", href: "/tests", icon: TestTube },
  { name: "Learning", href: "/learning", icon: GraduationCap },
  { name: "Therapists", href: "/therapists", icon: Users },
  { name: "Me", href: "/profile", icon: User },
];

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  // Check for user authentication
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    router.push('/');
  };

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
                          ? "text-white preserve-white bg-gradient-to-r from-teal-500 to-blue-500" 
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
            <div className="absolute right-6 hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName ? user.firstName[0] : user.name ? user.name[0] : 'U'}
                    </div>
                    <span className="text-white font-medium">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || 'User'
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.firstName ? user.firstName[0] : user.name ? user.name[0] : 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.name || 'User'
                                }
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username || 'username'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">My Profile</span>
                          </Link>
                          
                          {user.userCode && (
                            <Link
                              href={`/u/${user.userCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">Public Profile</span>
                            </Link>
                          )}
                          
                          <Link
                            href="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">Settings</span>
                          </Link>

                          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <ThemeToggle />
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
                      AI Platform
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
                              ? "text-white preserve-white bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 border border-teal-400/30" 
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
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.firstName ? user.firstName[0] : user.name ? user.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.name || 'User'
                            }
                          </p>
                          <p className="text-sm text-white/70">@{user.username || 'username'}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 py-2 text-white/90 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 py-2 text-white/90 hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center py-2 text-white/90 hover:text-white transition-colors font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">AI Online</span>
                    </div>
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
