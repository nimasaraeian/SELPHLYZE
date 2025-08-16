"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Plus, 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Filter,
  MoreHorizontal,
  Heart,
  Share2,
  MessageSquare,
  Eye,
  Send,
  Globe,
  Lock,
  Settings,
  LogOut,
  UserPlus,
  Award,
  Star,
  Briefcase,
  MapPin,
  Link,
  Image as ImageIcon,
  Video,
  FileText,
  Smile
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserTracking } from '@/hooks/useUserTracking';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { getUserContext, isLoggedIn } = useUserTracking();
  const router = useRouter();
  const user = getUserContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/social');
      return;
    }
    setLoading(false);
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your professional network...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to access your professional network.
          </p>
          <button
            onClick={() => router.push('/auth/login?redirect=/social')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-lg font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const mockPosts = [
    {
      id: 1,
      author: {
        name: "Dr. Sarah Johnson",
        title: "Clinical Psychologist",
        company: "Mind Wellness Center",
        avatar: "https://i.pravatar.cc/100?img=1",
        verified: true
      },
      content: "Just published a new research paper on the effectiveness of CBT in treating anxiety disorders. The results are promising and show significant improvement in 85% of participants. Looking forward to discussing this with colleagues! 📚🧠",
      timestamp: "2 hours ago",
      likes: 47,
      comments: 12,
      shares: 8,
      views: 234,
      tags: ["CBT", "Anxiety", "Research", "Psychology"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      author: {
        name: "Prof. Michael Chen",
        title: "Research Director",
        company: "Stanford Psychology Department",
        avatar: "https://i.pravatar.cc/100?img=2",
        verified: true
      },
      content: "Excited to announce our upcoming conference on 'The Future of Mental Health Technology' next month. We'll have speakers from Google, Apple, and leading research institutions. Early bird registration is now open! 🚀💻",
      timestamp: "5 hours ago",
      likes: 89,
      comments: 23,
      shares: 15,
      views: 567,
      tags: ["Mental Health", "Technology", "Conference", "Innovation"]
    },
    {
      id: 3,
      author: {
        name: "Dr. Emily Rodriguez",
        title: "Child Psychologist",
        company: "Family First Therapy",
        avatar: "https://i.pravatar.cc/100?img=3",
        verified: true
      },
      content: "Today's session with a 7-year-old client reminded me why I love this work. Using play therapy to help children process trauma is both challenging and incredibly rewarding. The resilience of children never ceases to amaze me. ❤️🧸",
      timestamp: "1 day ago",
      likes: 156,
      comments: 34,
      shares: 22,
      views: 892,
      tags: ["Child Psychology", "Play Therapy", "Trauma", "Resilience"]
    }
  ];

  const suggestedConnections = [
    {
      id: 1,
      name: "Dr. James Wilson",
      title: "Neuropsychologist",
      company: "Brain Research Institute",
      avatar: "https://i.pravatar.cc/100?img=4",
      mutualConnections: 12,
      verified: true
    },
    {
      id: 2,
      name: "Dr. Lisa Park",
      title: "Forensic Psychologist",
      company: "Criminal Justice Center",
      avatar: "https://i.pravatar.cc/100?img=5",
      mutualConnections: 8,
      verified: true
    },
    {
      id: 3,
      name: "Prof. David Thompson",
      title: "Industrial Psychologist",
      company: "Harvard Business School",
      avatar: "https://i.pravatar.cc/100?img=6",
      mutualConnections: 15,
      verified: true
    }
  ];

  const trendingTopics = [
    { tag: "CBT", posts: 145, trend: "up" },
    { tag: "mindfulness", posts: 89, trend: "up" },
    { tag: "anxiety", posts: 234, trend: "up" },
    { tag: "depression", posts: 167, trend: "down" },
    { tag: "therapy", posts: 98, trend: "up" },
    { tag: "AI in Psychology", posts: 67, trend: "up" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "CBT Workshop Series",
      date: "Tomorrow, 2:00 PM",
      attendees: 45,
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Psychology Research Symposium",
      date: "Friday, 7:00 PM",
      attendees: 128,
      type: "Conference",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop"
    }
  ];

  const handleCreatePost = () => {
    if (newPostContent.trim() || selectedFile) {
      // Here you would typically send the post to your backend
      console.log('Creating post:', { content: newPostContent, file: selectedFile });
      setNewPostContent('');
      setSelectedFile(null);
      setShowCreatePost(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your network..."
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              </div>

            {/* Center Section */}
            <div className="flex items-center space-x-1">
              {['feed', 'network', 'learning', 'jobs'].map((tab) => (
                    <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                  <Plus className="w-5 h-5" />
                <span>Create Post</span>
                </button>
            </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                                         <img
                       src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=0D9488&color=fff&size=100`}
                       alt="Profile"
                       className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                     />
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 mt-3">
                     {user?.firstName || 'User'} {user?.lastName || 'Name'}
                   </h3>
                   <p className="text-gray-600 text-sm">Professional</p>
                   <p className="text-gray-500 text-xs">Company</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile views</span>
                    <span className="font-medium text-gray-900">89</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Post impressions</span>
                    <span className="font-medium text-gray-900">1,234</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/tests')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Take Tests</p>
                      <p className="text-sm text-gray-500">Assess your knowledge</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/profile')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">My Profile</p>
                      <p className="text-sm text-gray-500">Update your information</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AI Assistant</p>
                      <p className="text-sm text-gray-500">Get help with AI</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trending Topics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Topics</h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div>
                          <span className="font-medium text-blue-600">#{topic.tag}</span>
                          <p className="text-sm text-gray-500">{topic.posts} posts</p>
                        </div>
                      <TrendingUp className={`w-5 h-5 ${topic.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            
            {/* Create Post Modal */}
            <AnimatePresence>
              {showCreatePost && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowCreatePost(false)}
                >
              <motion.div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Create a post</h3>
                        <button
                          onClick={() => setShowCreatePost(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start space-x-3">
                                                 <img
                           src={`https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=0D9488&color=fff&size=40`}
                           alt="Profile"
                           className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <textarea
                            value={newPostContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPostContent(e.target.value)}
                            placeholder="What do you want to talk about?"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={4}
                          />
                          
                          {selectedFile && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                              <span className="text-sm text-gray-600">{selectedFile.name}</span>
                              <button
                                onClick={() => setSelectedFile(null)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                        </button>
                      </div>
                          )}
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <label className="cursor-pointer p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <ImageIcon className="w-5 h-5" />
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  onChange={handleFileSelect}
                                  className="hidden"
                                />
                              </label>
                              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Video className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <FileText className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Smile className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Globe className="w-4 h-4" />
                                <span>Anyone</span>
                              </div>
                              <button
                                onClick={handleCreatePost}
                                disabled={!newPostContent.trim() && !selectedFile}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                              >
                                Post
                              </button>
                            </div>
                    </div>
                    </div>
                  </div>
                </div>
                  </motion.div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Posts Feed */}
            <div className="space-y-6">
              {mockPosts.map((post) => (
              <motion.div
                  key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                            {post.author.verified && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{post.author.title} at {post.author.company}</p>
                          <p className="text-xs text-gray-500">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      </div>
                    </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-900 mb-4 leading-relaxed">{post.content}</p>
                    
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                        </div>
                      </div>

                  {/* Post Stats */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                      <span>{post.views} views</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors">
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </button>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Suggested Connections */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Suggested for you</h3>
                <div className="space-y-4">
                  {suggestedConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center space-x-3">
                      <img
                        src={connection.avatar}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{connection.name}</h4>
                          {connection.verified && (
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                  </div>
                        <p className="text-sm text-gray-600">{connection.title}</p>
                        <p className="text-xs text-gray-500">{connection.company}</p>
                        <p className="text-xs text-blue-600">{connection.mutualConnections} mutual connections</p>
                  </div>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Connect
                      </button>
                  </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                        <p className="text-xs text-gray-500">{event.attendees} attending</p>
                        <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                          Join Event
                  </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Network */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  🎓 Professional Network
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Connect with psychology professionals and expand your network
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  View Network
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}