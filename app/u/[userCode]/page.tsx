"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Calendar,
  Award,
  Shield,
  ExternalLink,
  Share2,
  MessageCircle,
  Star,
  Building,
  Clock
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const userCode = params.userCode as string;

  useEffect(() => {
    // Check if current user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        // Invalid user data
      }
    }

    // Simulate fetching user profile by userCode
    // In real app, this would be an API call
    const fetchProfile = async () => {
      try {
        // For demo, check if it's the current user
        if (userData) {
          const user = JSON.parse(userData);
          if (user.userCode === userCode) {
            setProfileData(user);
          } else {
            // Simulate other users' profiles
            setProfileData(generateMockProfile(userCode));
          }
        } else {
          setProfileData(generateMockProfile(userCode));
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userCode]);

  const generateMockProfile = (code: string) => {
    // Generate mock profile based on userCode
    const profiles: { [key: string]: any } = {
      'clinpsyc2024': {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        username: 'drsarahjohnson',
        accountType: 'professional',
        specialization: 'Clinical Psychology',
        experience: 'Senior Level (7-15 years)',
        institution: 'Stanford Medical Center',
        verified: true,
        bio: 'Clinical psychologist specializing in anxiety disorders and trauma therapy. PhD from Harvard University.',
        location: 'San Francisco, CA',
        website: 'https://drsarahjohnson.com',
        joinDate: '2019-03-15',
        userCode: code,
        publicProfile: true
      },
      'studpsyc789': {
        firstName: 'Michael',
        lastName: 'Chen',
        username: 'michaelchen',
        accountType: 'student',
        specialization: 'Psychology Student',
        institution: 'UC Berkeley',
        verified: false,
        bio: 'PhD candidate in Cognitive Psychology. Interested in memory and learning research.',
        location: 'Berkeley, CA',
        joinDate: '2022-09-01',
        userCode: code,
        publicProfile: true
      }
    };

    return profiles[code] || null;
  };

  const isOwnProfile = currentUser && currentUser.userCode === userCode;

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${userCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.firstName} ${profileData.lastName} - Selphlyze`,
          text: profileData.bio || 'Psychology professional on Selphlyze',
          url: url
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert('Profile URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Profile URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profileData) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Profile Not Found</h1>
          <p className="text-[var(--muted)] mb-8">
            The profile you're looking for doesn't exist or has been made private.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header with Cover */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-teal-500 rounded-3xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-end justify-between">
              <div className="flex items-end space-x-6">
                {/* Profile Picture */}
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-700 shadow-xl">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
                
                {/* Basic Info */}
                <div className="text-white pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    {profileData.verified && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-white/90 mb-2">@{profileData.username}</p>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                    </div>
                    {profileData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                {!isOwnProfile && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    <MessageCircle className="w-4 h-4" />
                    Connect
                  </button>
                )}
                {isOwnProfile && (
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - About */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">About</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                {profileData.bio || 'No bio available.'}
              </p>
            </motion.div>

            {/* Professional Info */}
            {profileData.accountType === 'professional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Professional Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-[var(--accent)] rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-[var(--muted)]">Specialization</div>
                      <div className="font-medium">{profileData.specialization}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--accent)] rounded-lg">
                    <Star className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm text-[var(--muted)]">Experience</div>
                      <div className="font-medium">{profileData.experience}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[var(--accent)] rounded-lg md:col-span-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-[var(--muted)]">Institution</div>
                      <div className="font-medium">{profileData.institution}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Info (if available) */}
            {profileData.website && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Contact</h3>
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[var(--accent)] rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-[var(--muted)]">Website</div>
                    <div className="font-medium text-blue-600">{profileData.website}</div>
                  </div>
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            
            {/* Account Type */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Account Type</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                profileData.accountType === 'professional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                profileData.accountType === 'student' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
              }`}>
                {profileData.accountType === 'professional' && <Award className="w-4 h-4 mr-2" />}
                {profileData.accountType === 'student' && <GraduationCap className="w-4 h-4 mr-2" />}
                {profileData.accountType === 'individual' && <User className="w-4 h-4 mr-2" />}
                {profileData.accountType.charAt(0).toUpperCase() + profileData.accountType.slice(1)} Account
              </div>
            </motion.div>

            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Profile Views</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Connections</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] text-sm">Posts</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </motion.div>

            {/* Share Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6"
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔗 Share This Profile
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                Share this professional profile with your network
              </p>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border">
                <code className="flex-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                  selphlyze.com/u/{userCode}
                </code>
                <button
                  onClick={handleShare}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
