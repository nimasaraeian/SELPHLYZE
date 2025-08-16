"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette,
  Save,
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditData(parsedUser);
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSave = () => {
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(editData));
    setUser(editData);
    setIsEditing(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Update password (in real app, this would call an API)
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
          >
            Settings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--muted)]"
          >
            Manage your account settings and preferences
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Left Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow-sm"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:col-span-3">
            
            {/* Account Settings */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Account Information</h3>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1 px-3 py-1 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <span>{user.firstName || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <span>{user.lastName || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                      <span>{user.email}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <span>{user.phone || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-[var(--muted)]">Receive updates about your account and activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-lg">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-[var(--muted)]">Get notified about new messages and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-lg">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-[var(--muted)]">Receive updates about new features and services</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Privacy & Data</h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Data Protection</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Your personal data is encrypted and protected. We never share your information with third parties without your explicit consent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-lg">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-[var(--muted)]">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-lg">
                    <div>
                      <h4 className="font-medium">Analytics & Tracking</h4>
                      <p className="text-sm text-[var(--muted)]">Allow us to collect usage data to improve our services</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Appearance & Theme</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-3">
                      Theme Preference
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                        <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2"></div>
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button className="p-4 border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <div className="w-8 h-8 bg-gray-800 rounded-full mx-auto mb-2"></div>
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button className="p-4 border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-sm font-medium">Auto</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-3">
                      Font Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <button className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--accent)]">Small</button>
                      <button className="px-3 py-1 text-base border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">Medium</button>
                      <button className="px-3 py-1 text-lg border border-[var(--border)] rounded hover:bg-[var(--accent)]">Large</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-3">
                      Color Scheme
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      <button className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-blue-600"></button>
                      <button className="w-12 h-12 bg-purple-500 rounded-lg border-2 border-transparent hover:border-purple-600"></button>
                      <button className="w-12 h-12 bg-green-500 rounded-lg border-2 border-transparent hover:border-green-600"></button>
                      <button className="w-12 h-12 bg-orange-500 rounded-lg border-2 border-transparent hover:border-orange-600"></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



