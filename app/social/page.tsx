"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BookOpen, Calendar, Bell, Search, Plus } from 'lucide-react';
import SocialFeed from '@/components/social/SocialFeed';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');

  const sidebarItems = [
    { id: 'feed', label: 'Home', icon: Users, active: true },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  const trendingTopics = [
    { tag: 'CBT', posts: 145 },
    { tag: 'mindfulness', posts: 89 },
    { tag: 'anxiety', posts: 234 },
    { tag: 'depression', posts: 167 },
    { tag: 'therapy', posts: 98 },
  ];

  const suggestedGroups = [
    {
      id: '1',
      name: 'Anxiety Support Group',
      members: 1250,
      description: 'A safe space to share experiences',
      image: 'https://i.pravatar.cc/100?img=10'
    },
    {
      id: '2', 
      name: 'CBT Specialists',
      members: 450,
      description: 'Network of CBT therapists',
      image: 'https://i.pravatar.cc/100?img=11'
    },
    {
      id: '3',
      name: 'Psychology Research',
      members: 678,
      description: 'Collaboration in academic research',
      image: 'https://i.pravatar.cc/100?img=12'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Psychology Social Network
                </h2>
                <p className="text-sm text-gray-600">
                  A community of psychology professionals and enthusiasts
                </p>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Create New Post</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {activeTab === 'feed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SocialFeed />
              </motion.div>
            )}

            {activeTab === 'trending' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Topics</h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div>
                          <span className="font-medium text-blue-600">#{topic.tag}</span>
                          <p className="text-sm text-gray-500">{topic.posts} posts</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'groups' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Suggested Groups</h3>
                  <div className="space-y-4">
                    {suggestedGroups.map((group) => (
                      <div key={group.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.description}</p>
                          <p className="text-xs text-gray-500">{group.members} members</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">Research Articles</h4>
                      <p className="text-sm text-gray-600">Latest psychology research papers</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <Users className="w-8 h-8 text-green-600 mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">Study Groups</h4>
                      <p className="text-sm text-gray-600">Collaborative learning sessions</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">CBT Workshop</h4>
                          <p className="text-sm text-gray-600">Advanced techniques in cognitive behavioral therapy</p>
                          <p className="text-xs text-gray-500 mt-1">Tomorrow at 2:00 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Psychology Webinar</h4>
                          <p className="text-sm text-gray-600">Latest trends in positive psychology</p>
                          <p className="text-xs text-gray-500 mt-1">Friday at 7:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search in network..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Posts</span>
                    <span className="font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Online Users</span>
                    <span className="font-medium text-green-600">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Groups</span>
                    <span className="font-medium text-gray-900">5</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Learning Resources</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Upcoming Events</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">Notifications</span>
                  </button>
                </div>
              </div>

              {/* Professional Network */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  🎓 Professional Network
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Connect with psychology professionals
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  View Professionals
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}