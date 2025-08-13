"use client";
import { useState, useEffect } from "react";
// Supabase may be unavailable in some environments; we'll lazy-load it
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Edit, 
  Camera, 
  Save, 
  X,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Languages,
  Award,
  Star,
  Users,
  MessageCircle,
  Video,
  TrendingUp,
  Clock,
  Heart,
  Brain,
  Zap,
  Globe,
  Phone,
  Mail,
  Plus,
  Trash2
} from "lucide-react";
import ProfileDashboard from "@/components/ProfileDashboard";

type UserType = "therapist" | "client" | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
  // Common fields
  location: string;
  joinDate: string;
  bio: string;
  languages: string[];
  
  // Therapist specific
  title?: string;
  specializations?: string[];
  experience?: string;
  credentials?: string[];
  consultationCode?: string;
  hourlyRate?: number;
  currency?: string;
  rating?: number;
  totalClients?: number;
  completedSessions?: number;
  availability?: boolean;
  workingHours?: {
    start: string;
    end: string;
    days: string[];
  };
  
  // Client specific
  interests?: string[];
  therapistHistory?: string[];
  testResults?: {
    testName: string;
    score: number;
    date: string;
  }[];
  goals?: string[];
}

export default function ProfilePage() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load or create profile on auth (lazy supabase)
  useEffect(() => {
    const init = async () => {
      let supabase: any = null;
      try { supabase = (await import("@/app/lib/supabaseClient")).supabase; } catch {}
      if (!supabase) { setProfile(null); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { return; }
      const user = session.user;
      setUserId(user.id);
      // load
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (!p) {
        // create default profile
        const insert = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          avatar_url: '',
          bio: '',
          location: '',
          languages: ['English'],
          user_type: 'client',
        } as any;
        await supabase.from('profiles').insert(insert);
      }
      const { data: p2 } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p2) {
        const mapped: UserProfile = {
          id: p2.id,
          name: p2.full_name || user.email || 'User',
          email: user.email || '',
          avatar: p2.avatar_url || '',
          userType: (p2.user_type as UserType) || 'client',
          location: p2.location || '',
          joinDate: user.created_at || new Date().toISOString(),
          bio: p2.bio || '',
          languages: Array.isArray(p2.languages) ? p2.languages : [],
          therapistHistory: Array.isArray(p2.therapists) ? p2.therapists : [],
          testResults: [],
        };
        setProfile(mapped);
        setUserType(mapped.userType);
        // load test results
        const { data: results } = await supabase.from('test_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (results) {
          setProfile((prev) => prev ? ({ ...prev, testResults: results.map((r: any) => ({ testName: r.test_name || r.test_slug, score: Number(r.score ?? 0), date: new Date(r.finished_at || r.created_at).toLocaleString() })) }) : prev);
        }
      }
    };
    init();
  }, []);

  // Realtime updates for test_results so charts are always live
  useEffect(() => {
    const subscribe = async () => {
      if (!userId) return;
      try {
        const supabase = (await import("@/app/lib/supabaseClient")).supabase;
        const channel = supabase
          .channel("realtime-test-results")
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'test_results', filter: `user_id=eq.${userId}` },
            async () => {
              const { data: results } = await supabase
                .from('test_results')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
              if (results) {
                setProfile((prev) => prev ? ({
                  ...prev,
                  testResults: results.map((r: any) => ({
                    testName: r.test_name || r.test_slug,
                    score: Number(r.score ?? 0),
                    date: new Date(r.finished_at || r.created_at).toLocaleString(),
                  }))
                }) : prev);
              }
            }
          )
          .subscribe();

        return () => {
          try { supabase.removeChannel(channel); } catch {}
        };
      } catch {}
    };

    const cleanupPromise = subscribe();
    return () => {
      // ensure cleanup awaited if provided
      Promise.resolve(cleanupPromise).catch(() => {});
    };
  }, [userId]);

  // Load saved module results (e.g., Synclyze) from localStorage
  const [synclyzeResult, setSynclyzeResult] = useState<any | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('synclyzeResult');
      if (raw) setSynclyzeResult(JSON.parse(raw));
    } catch {}
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!profile) return;
    const supabase = (await import("@/app/lib/supabaseClient")).supabase;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const user = session.user;
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const url = data.publicUrl;
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      setProfile({ ...profile, avatar: url });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsEditing(false);
      const supabase = (await import("@/app/lib/supabaseClient")).supabase;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !profile) return;
      await supabase.from('profiles').update({ full_name: profile.name, bio: profile.bio, location: profile.location }).eq('id', session.user.id);
    } catch {}
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Guest header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 grid place-items-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Guest</h1>
                <p className="text-gray-400 text-sm">Public view</p>
              </div>
            </div>
          </motion.div>
          <ProfileDashboard name="Guest" testResults={[]} />

          {/* Guest can still view module results saved locally */}
          <div className="mt-8 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Module Results</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Synclyze Code</div>
                <div className="inline-block px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-teal-300 font-mono">
                  {synclyzeResult?.code || '—'}
                </div>
                <div className="mt-4">
                  {synclyzeResult?.scores ? (
                    <SimpleBars scores={synclyzeResult.scores} />
                  ) : (
                    <p className="text-slate-400 text-sm">Complete the Synclyze module to see your scores.</p>
                  )}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Radar Overview</div>
                {synclyzeResult?.scores ? (
                  <MiniRadar scores={synclyzeResult.scores} />
                ) : (
                  <div className="h-48 grid place-items-center text-slate-500 text-sm">No data</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-400 to-blue-500 p-1"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center border-4 border-slate-900"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = () => {
                    const f = (input.files && input.files[0]) as File | undefined;
                    if (f) handleAvatarUpload(f);
                  };
                  input.click();
                }}
              >
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  {profile.userType === "therapist" && (
                    <p className="text-teal-300 text-lg font-medium mb-2">{profile.title}</p>
                  )}
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Stats for Therapist */}
              {profile.userType === "therapist" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{profile.rating}</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{profile.totalClients}</div>
                    <div className="text-xs text-gray-400">Clients</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <Video className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{profile.completedSessions}</div>
                    <div className="text-xs text-gray-400">Sessions</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{profile.experience}</div>
                    <div className="text-xs text-gray-400">Experience</div>
                  </div>
                </div>
              )}

              {/* Bio */}
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        </motion.div>

        {/* Onboarding section temporarily disabled per request */}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "profile", label: "Profile", icon: User },
            { id: "settings", label: "Settings", icon: Settings },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "results", label: "Results", icon: Zap },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="mb-8">
                <ProfileDashboard name={profile.name} testResults={profile.testResults || []} />
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-400" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-white">{profile.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none resize-none"
                        />
                      ) : (
                        <p className="text-white">{profile.bio}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-teal-600/20 text-teal-300 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information (Therapist) or Interests (Client) */}
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  {profile.userType === "therapist" ? (
                    <>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        Professional Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                          <p className="text-white">{profile.title}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Consultation Code</label>
                          <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
                            <code className="text-teal-300 font-mono">{profile.consultationCode}</code>
                            <button className="text-gray-400 hover:text-white text-sm">Copy</button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate</label>
                          <p className="text-white">${profile.hourlyRate} {profile.currency}/hour</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Specializations</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.specializations?.map((spec, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Credentials</label>
                          <div className="space-y-2">
                            {profile.credentials?.map((cred, index) => (
                              <div key={index} className="flex items-center gap-2 text-white">
                                <Award className="w-4 h-4 text-yellow-400" />
                                {cred}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${profile.availability ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-white">{profile.availability ? 'Available' : 'Busy'}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        Interests & Goals
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests?.map((interest, index) => (
                              <span key={index} className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Personal Goals</label>
                          <div className="space-y-2">
                            {profile.goals?.map((goal, index) => (
                              <div key={index} className="flex items-center gap-2 text-white">
                                <Brain className="w-4 h-4 text-purple-400" />
                                {goal}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Test Results</label>
                          <div className="space-y-2">
                            {profile.testResults?.map((result, index) => (
                              <div key={index} className="p-3 bg-slate-800 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-white font-medium">{result.testName}</span>
                                  <span className="text-teal-300">{result.score}%</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{result.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && (
              <div className="grid gap-6">
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Module Results</h3>
                  {/* Synclyze summary */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                      <div className="text-sm text-slate-400 mb-1">Synclyze Code</div>
                      <div className="inline-block px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-teal-300 font-mono">
                        {synclyzeResult?.code || '—'}
                      </div>
                      <div className="mt-4">
                        {synclyzeResult?.scores ? (
                          <SimpleBars scores={synclyzeResult.scores} />
                        ) : (
                          <p className="text-slate-400 text-sm">Complete the Synclyze module to see your scores.</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                      <div className="text-sm text-slate-400 mb-1">Radar Overview</div>
                      {synclyzeResult?.scores ? (
                        <MiniRadar scores={synclyzeResult.scores} />
                      ) : (
                        <div className="h-48 grid place-items-center text-slate-500 text-sm">No data</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 text-slate-400 text-xs">More modules will appear here as you complete them.</div>
                </div>
                {/* Final composite code box (placeholder until all modules done) */}
                <div className="bg-gradient-to-br from-emerald-900/10 to-teal-900/10 border border-emerald-700/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Your Composite Code</h3>
                  <p className="text-slate-300 text-sm mb-3">This unlocks when you complete all modules.</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 font-mono">
                    PARTIAL: {synclyzeResult?.code ? synclyzeResult.code.replace('SYNC(', 'SYNC(…+') : 'SYNC(…+?)'}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  Account Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive email updates about your account</p>
                    </div>
                    <button className="relative w-12 h-6 bg-teal-600 rounded-full">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Profile Visibility</h4>
                      <p className="text-gray-400 text-sm">Control who can see your profile</p>
                    </div>
                    <select className="bg-slate-700 text-white px-3 py-2 rounded-lg">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Contacts Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                      />
                      <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white">Windows PC - Chrome</p>
                          <p className="text-gray-400 text-sm">Current session • Tehran, Iran</p>
                        </div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white">iPhone - Safari</p>
                          <p className="text-gray-400 text-sm">2 hours ago • Tehran, Iran</p>
                        </div>
                        <button className="text-red-400 hover:text-red-300 text-sm">Terminate</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Notification Preferences
                </h3>
                
                <div className="space-y-4">
                  {[
                    { title: "New Messages", description: "Get notified when you receive new messages" },
                    { title: "Appointment Reminders", description: "Receive reminders before scheduled sessions" },
                    { title: "Test Results", description: "Get notified when test results are ready" },
                    { title: "System Updates", description: "Important updates about the platform" },
                    { title: "Marketing", description: "News, tips, and special offers" }
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        <p className="text-gray-400 text-sm">{notification.description}</p>
                      </div>
                      <button className="relative w-12 h-6 bg-slate-600 rounded-full">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
            <div className="mt-3">
              <button onClick={async()=>{ const s = (await import("@/app/lib/supabaseClient")).supabase; await s.auth.signOut(); location.reload(); }} className="text-sm text-gray-400 hover:text-white">Sign out</button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function SimpleBars({ scores }: { scores: { attachment: number; eq: number; conflict: number; empathy: number; language: number } }) {
  const items = [
    { k: 'attachment', l: 'Attachment', v: scores.attachment },
    { k: 'eq', l: 'Emotional Intelligence', v: scores.eq },
    { k: 'conflict', l: 'Conflict Style', v: scores.conflict },
    { k: 'empathy', l: 'Empathy Accuracy', v: scores.empathy },
    { k: 'language', l: 'Language Style', v: scores.language },
  ];
  return (
    <div className="space-y-2">
      {items.map(it => (
        <div key={it.k}>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{it.l}</span>
            <span>{it.v}/5</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" style={{ width: `${Math.max(2, Math.min(100, (it.v/5)*100))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniRadar({ scores }: { scores: { attachment: number; eq: number; conflict: number; empathy: number; language: number } }) {
  const labels = ["Attach", "EQ", "Conflict", "Empathy", "Lang"];
  const values = [scores.attachment, scores.eq, scores.conflict, scores.empathy, scores.language];
  const max = 5;
  const cx = 120, cy = 90;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const r = (v / max) * 70;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 240 180" className="w-full h-48">
      <g stroke="#334155" strokeOpacity="0.6" fill="none">
        {[20,40,60,70].map(r => <circle key={r} cx={cx} cy={cy} r={r} />)}
      </g>
      <polygon points={points.join(' ')} fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth={2} />
      {points.map((p,i)=>{ const [x,y]=p.split(',').map(Number); return <circle key={i} cx={x} cy={y} r={3} fill="#22d3ee" />})}
      {labels.map((t,i)=>{ const a=(Math.PI*2*i)/labels.length - Math.PI/2; const x=cx+80*Math.cos(a); const y=cy+80*Math.sin(a); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="10">{t}</text>; })}
    </svg>
  );
}
