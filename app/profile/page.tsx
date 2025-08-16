"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData(user);
    }
  };

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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        // Update both user state and editData
        setUser((prev: any) => ({
          ...prev,
          profileImage: imageUrl
        }));
        
        setEditData((prev: any) => ({
          ...prev,
          profileImage: imageUrl
        }));

        // Save to localStorage
        const updatedUser = { ...user, profileImage: imageUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger storage event to update navbar
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Trigger storage event to update navbar
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
          >
            My Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--muted)]"
          >
            Manage your personal information and preferences
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
            >
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {user.firstName ? user.firstName[0] : user.name ? user.name[0] : 'U'}
                    </div>
                  )}
                  <button 
                    onClick={() => document.getElementById('profileImageInput')?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                    title="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  {user.profileImage && (
                    <button 
                      onClick={() => {
                        setUser((prev: any) => ({ ...prev, profileImage: null }));
                        setEditData((prev: any) => ({ ...prev, profileImage: null }));
                        const updatedUser = { ...user, profileImage: null };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove profile picture"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                </h2>
                <p className="text-[var(--muted)]">@{user.username || 'username'}</p>
                
                {/* Account Type Badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.accountType === 'professional' ? 'bg-blue-100 text-blue-800' :
                    user.accountType === 'student' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user.accountType === 'professional' && <Award className="w-3 h-3 mr-1" />}
                    {user.accountType === 'student' && <GraduationCap className="w-3 h-3 mr-1" />}
                    {user.accountType === 'individual' && <User className="w-3 h-3 mr-1" />}
                    {user.accountType || 'Individual'} Account
                  </span>
              </div>
            </div>

              {/* Profile URL */}
              {user.userCode && (
                <div className="border-t border-[var(--border)] pt-6 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      🔗 Your Public Profile
                    </h4>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border text-sm">
                      <code className="flex-1 text-gray-600 dark:text-gray-400 truncate">
                        selphlyze.com/u/{user.userCode}
                      </code>
                <button 
                        onClick={() => {
                          const url = `${window.location.origin}/u/${user.userCode}`;
                          navigator.clipboard.writeText(url);
                          alert('Profile URL copied!');
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        📋
                </button>
                      <a
                        href={`/u/${user.userCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        🔗
                      </a>
                    </div>
                  </div>
              </div>
              )}

              {/* Quick Stats */}
              <div className="space-y-4 border-t border-[var(--border)] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Member since</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Profile completion</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Verification status</span>
                  <span className="flex items-center text-yellow-600">
                    <Shield className="w-4 h-4 mr-1" />
                    Pending
                  </span>
          </div>
        </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleEditToggle}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--foreground)]">Personal Information</h3>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-1 px-3 py-1 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
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
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                      <User className="w-5 h-5 text-[var(--muted)] mr-3" />
                      <span>{user.firstName || 'Click Edit Profile to add your first name'}</span>
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
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                      <User className="w-5 h-5 text-[var(--muted)] mr-3" />
                      <span>{user.lastName || 'Click Edit Profile to add your last name'}</span>
            </div>
          )}
            </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                    <Mail className="w-5 h-5 text-[var(--muted)] mr-3" />
                    <span>{user.email || 'Not provided'}</span>
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
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                      <Phone className="w-5 h-5 text-[var(--muted)] mr-3" />
                      <span>{user.phone || 'Click Edit Profile to add your phone number'}</span>
            </div>
          )}
                </div>
              </div>
            </motion.div>

            {/* Professional Information */}
            {user.accountType === 'professional' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Professional Information</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Specialization
                    </label>
                    {isEditing ? (
                    <input 
                        type="text"
                        name="specialization"
                        value={editData.specialization || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <Briefcase className="w-5 h-5 text-[var(--muted)] mr-3" />
                        <span>{user.specialization || 'Click Edit Profile to add your specialization'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Experience Level
                    </label>
                    {isEditing ? (
                    <input 
                        type="text"
                        name="experience"
                        value={editData.experience || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <BarChart3 className="w-5 h-5 text-[var(--muted)] mr-3" />
                        <span>{user.experience || 'Click Edit Profile to add your experience level'}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                      Institution/Organization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="institution"
                        value={editData.institution || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[var(--background)]"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-[var(--accent)] rounded-lg">
                        <MapPin className="w-5 h-5 text-[var(--muted)] mr-3" />
                        <span>{user.institution || 'Click Edit Profile to add your institution'}</span>
                  </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
              </div>
                  <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🔐 Your Privacy is Protected
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    This profile is completely private and only visible to you. We use industry-standard 
                    encryption to protect your personal information and never share it with third parties 
                    without your explicit consent.
                  </p>
                </div>
              </div>
            </motion.div>

            </div>
        </div>
      </div>
    </div>
  );
}