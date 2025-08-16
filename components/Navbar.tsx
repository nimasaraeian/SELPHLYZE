"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Home, 
  Users, 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  Plus,
  ChevronDown,
  Globe,
  Lock,
  Shield,
  HelpCircle,
  Sun,
  Moon,
  Languages,
  Briefcase,
  Calendar,
  TrendingUp,
  Award,
  Star,
  MapPin,
  Link as LinkIcon,
  Mail,
  Phone,
  Camera,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserTracking } from '@/hooks/useUserTracking';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { getUserContext, isLoggedIn } = useUserTracking();
  const router = useRouter();
  const pathname = usePathname();
  const user = getUserContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavItems = (user: any, pathname: string): NavItem[] => {
    const items: NavItem[] = [
      { label: 'AI', href: '/', icon: Home, description: 'AI Assistant & Analysis' },
      { label: 'Social', href: '/social', icon: Users, description: 'Professional Network' },
      { label: 'Tests', href: '/tests', icon: Award, description: 'Psychological Assessments' },
      { label: 'Learning', href: '/learning', icon: BookOpen, description: 'Educational Resources' },
      { label: 'Therapists', href: '/therapists', icon: User, description: 'Find Professionals' },
      { label: 'Me', href: '/profile', icon: User, description: 'My Profile & Settings' }
    ];

    return items;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowUserMenu(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add dark mode logic here
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Add language change logic here
  };

  const navItems = getNavItems(user, pathname);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full fixed top-2 z-[999999] transition-all duration-500 ${
          scrolled 
            ? "glass-dark shadow-2xl py-4" 
            : "bg-white/95 backdrop-blur-md border-b border-gray-200 py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img
                  src="/image/SELPHLYZE_LOGO.png"
                  alt="SELPHLYZE Logo"
                  className="w-12 h-12 object-contain drop-shadow-sm"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SELPHLYZE
                </span>
              </div>
              
              {/* Main Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                                 {navItems.map((item) => {
                   const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                     <motion.button
                       key={item.label}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => router.push(item.href)}
                       className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                         isActive
                           ? 'bg-blue-50 text-blue-700 border border-blue-200'
                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                       }`}
                       title={item.description}
                     >
                       <div className="flex items-center space-x-2">
                         <Icon className="w-5 h-5" />
                         <span>{item.label}</span>
                       </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </motion.button>
                );
              })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              
              {/* Search */}
              <div className="relative" ref={searchRef}>
                  <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-6 h-6" />
                  </button>

                  <AnimatePresence>
                  {showSearch && (
                      <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                    >
                      <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for people, posts, topics..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                            </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Quick filters:</span>
                          <div className="flex space-x-2">
                            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                              People
                            </button>
                            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                              Posts
                            </button>
                            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                              Topics
                            </button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Messages */}
              <div className="relative" ref={messagesRef}>
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {showMessages && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <img
                            src="https://i.pravatar.cc/100?img=1"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Dr. Sarah Johnson</p>
                            <p className="text-gray-500 text-xs">Thanks for the connection request!</p>
                          </div>
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <img
                            src="https://i.pravatar.cc/100?img=2"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Prof. Michael Chen</p>
                            <p className="text-gray-500 text-xs">Great article you shared!</p>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Mark all read
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">
                              <span className="font-medium">Dr. Emily Rodriguez</span> accepted your connection request
                            </p>
                            <p className="text-gray-500 text-xs">2 hours ago</p>
                          </div>
            </div>
            
                        <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">
                              New test available: <span className="font-medium">Anxiety Assessment</span>
                            </p>
                            <p className="text-gray-500 text-xs">1 day ago</p>
                          </div>
                        </div>
                      </div>
                  </motion.div>
                )}
              </AnimatePresence>
        </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                                     <img
                     src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=0D9488&color=fff&size=40`}
                     alt="Profile"
                     className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                   />
                   <div className="hidden md:block text-left">
                     <p className="text-sm font-medium text-gray-900">
                       {user?.firstName || 'User'} {user?.lastName || 'Name'}
                     </p>
                     <p className="text-xs text-gray-500">Professional</p>
                   </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                      <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                                                     <img
                             src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=0D9488&color=fff&size=60`}
                             alt="Profile"
                             className="w-12 h-12 rounded-full object-cover"
                           />
                        <div>
                             <p className="font-semibold text-gray-900">
                               {user?.firstName || 'User'} {user?.lastName || 'Name'}
                             </p>
                             <p className="text-sm text-gray-600">Professional</p>
                             <p className="text-xs text-gray-500">Company</p>
                           </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <User className="w-5 h-5" />
                          <span>View Profile</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-5 h-5" />
                          <span>Edit Profile</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          <span>Public Profile</span>
                        </button>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      {/* Additional Options */}
                      <div className="py-2">
                        <button
                          onClick={toggleDarkMode}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        
                        <button
                          onClick={() => changeLanguage(language === 'en' ? 'fa' : 'en')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Languages className="w-5 h-5" />
                          <span>{language === 'en' ? 'فارسی' : 'English'}</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/help');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span>Help & Support</span>
                        </button>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
