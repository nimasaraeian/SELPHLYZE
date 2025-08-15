"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BookOpen, Calendar, Bell, Search, Plus } from 'lucide-react';
import SocialFeed from '@/components/social/SocialFeed';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');

  const sidebarItems = [
    { id: 'feed', label: 'خانه', icon: Users, active: true },
    { id: 'trending', label: 'ترندها', icon: TrendingUp },
    { id: 'groups', label: 'گروه‌ها', icon: Users },
    { id: 'resources', label: 'منابع', icon: BookOpen },
    { id: 'events', label: 'رویدادها', icon: Calendar },
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
      name: 'گروه حمایت اضطراب',
      members: 1250,
      description: 'محیطی امن برای به اشتراک گذاری تجربیات',
      image: 'https://i.pravatar.cc/100?img=10'
    },
    {
      id: '2', 
      name: 'CBT متخصصان',
      members: 450,
      description: 'شبکه‌ای از درمانگران CBT',
      image: 'https://i.pravatar.cc/100?img=11'
    },
    {
      id: '3',
      name: 'تحقیقات روانشناسی',
      members: 678,
      description: 'همکاری در تحقیقات دانشگاهی',
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
                  شبکه اجتماعی روانشناسی
                </h2>
                <p className="text-sm text-gray-600">
                  جامعه‌ای از متخصصان و علاقه‌مندان به روانشناسی
                </p>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-right transition-colors ${
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
                <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>ایجاد پست جدید</span>
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">موضوعات داغ</h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div>
                          <span className="font-medium text-blue-600">#{topic.tag}</span>
                          <p className="text-sm text-gray-500">{topic.posts} پست</p>
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">گروه‌های پیشنهادی</h3>
                  <div className="space-y-4">
                    {suggestedGroups.map((group) => (
                      <div key={group.id} className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.description}</p>
                          <p className="text-xs text-gray-500">{group.members} عضو</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          پیوستن
                        </button>
                      </div>
                    ))}
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
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="جستجو در شبکه..."
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">خلاصه فعالیت</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">پست‌های امروز</span>
                    <span className="font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">کاربران آنلاین</span>
                    <span className="font-medium text-green-600">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">گروه‌های فعال</span>
                    <span className="font-medium text-gray-900">5</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">دسترسی سریع</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 space-x-reverse p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">منابع آموزشی</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 space-x-reverse p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">رویدادهای آتی</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 space-x-reverse p-3 text-right hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">اعلان‌ها</span>
                  </button>
                </div>
              </div>

              {/* Professional Network */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  🎓 شبکه حرفه‌ای
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  با متخصصان حوزه روانشناسی ارتباط برقرار کنید
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  مشاهده متخصصان
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
