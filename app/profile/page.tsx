"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Upload, LogOut, Settings, Library, Book, Headphones, Activity, Users, Shield, BarChart3, Plus, Pencil } from "lucide-react";
import { motion } from "framer-motion";

// Resize image to prevent localStorage quota exceeded
async function resizeImageToDataUrl(file: File, maxSizePx: number = 200, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSizePx) {
            height = Math.round((height * maxSizePx) / width);
            width = maxSizePx;
          }
        } else {
          if (height > maxSizePx) {
            width = Math.round((width * maxSizePx) / height);
            height = maxSizePx;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

// Read profile from localStorage
function readLocalProfile() {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("localProfileV1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Read test results from localStorage
function readTestResults() {
  try {
    if (typeof window === "undefined") return [];
    const results = [];
    
    // General personality test
    const general = localStorage.getItem("selphlyze_general_personality_v1");
    if (general) {
      const data = JSON.parse(general);
      results.push({
        id: "general-personality", 
        title: "General Personality Test", 
        date: new Date().toISOString().split('T')[0], 
        status: "Completed", 
        score: 85
      });
    }
    
    // Other tests
    const pp = localStorage.getItem("testAnswers");
    if (pp) {
      const data = JSON.parse(pp);
      results.push({
        id: "personality-psychology", 
        title: "Personality Psychology", 
        date: new Date().toISOString().split('T')[0], 
        status: "Completed", 
        score: 78
      });
    }
    
    return results;
  } catch {
    return [];
  }
}

// Mock data for demonstration
const mockTraits = [
  { dimension: "Openness", value: 82 },
  { dimension: "Conscientiousness", value: 61 },
  { dimension: "Extraversion", value: 45 },
  { dimension: "Agreeableness", value: 72 },
  { dimension: "Neuroticism", value: 38 },
];

const mockModules = [
  { id: "m_01", name: "Synclyze", progress: 100, tag: "Complete" },
  { id: "m_02", name: "Shadowlyze", progress: 70, tag: "In Progress" },
  { id: "m_03", name: "Joblyze", progress: 40, tag: "Started" },
];

const mockBooks = [
  { id: "b_01", title: "Thinking, Fast and Slow", status: "Completed" },
  { id: "b_02", title: "The Body Keeps the Score", status: "Reading" },
  { id: "b_03", title: "Predictably Irrational", status: "Wishlist" },
];

const mockPodcasts = [
  { id: "p_01", title: "Hidden Brain — Emotions at Work", listened: true },
  { id: "p_02", title: "Lex Fridman — Psychology & AI", listened: false },
];

const mockTherapist = {
  id: "th_01",
  name: "Dr. Sara Ahmadi",
  specialty: "Cognitive Behavioral Therapy (CBT)",
  avatarUrl: "https://i.pravatar.cc/160?img=47",
  email: "sara.ahmadi@selphlyze.com",
  phone: "+98 912 345 6789",
  nextSession: "2025-01-25 14:00",
};

export default function ProfileDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Move useMemo before early returns to maintain hook order
  const initials = useMemo(() => {
    if (!profile?.fullName) return "U";
    const parts = profile.fullName.split(" ");
    return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
  }, [profile?.fullName]);

  useEffect(() => {
    setMounted(true);
    const p = readLocalProfile();
    const tests = readTestResults();
    setProfile(p);
    setTestResults(tests);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem("localProfileV1");
      localStorage.removeItem("aiUserProfile");
      localStorage.removeItem("selphlyze_general_personality_v1");
      localStorage.removeItem("testAnswers");
      setProfile(null);
      setTestResults([]);
      window.location.href = "/";
    } catch {}
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Resize image to prevent localStorage quota exceeded
      const resizedDataUrl = await resizeImageToDataUrl(file, 200, 0.7);
      setAvatarPreview(resizedDataUrl);
      
      // Save to profile
      if (profile) {
        const updated = { ...profile, avatarDataUrl: resizedDataUrl };
        localStorage.setItem("localProfileV1", JSON.stringify(updated));
        setProfile(updated);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("خطا در پردازش تصویر. لطفاً تصویر کوچک‌تری انتخاب کنید.");
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  // Define user object before any early returns to maintain hook order
  const user = {
    id: "user_1",
    name: profile?.fullName || "User",
    email: "user@selphlyze.com",
    avatarUrl: profile?.avatarDataUrl || "https://i.pravatar.cc/160?img=32",
    bio: `Age: ${profile?.ageRange || '-'} • Gender: ${profile?.gender || '-'}`
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-[var(--muted)] mb-6">Please complete your profile first.</p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      {/* Top bar */}
      <div className="sticky top-16 z-30 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-teal-600" />
            <span className="text-lg font-semibold">Selphlyze</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSignOut} 
              className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] flex items-center gap-2"
            >
              <LogOut className="h-4 w-4"/> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Profile header */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
                {(avatarPreview || user.avatarUrl) ? (
                  <img 
                    src={avatarPreview || user.avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <span className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs">Member</span>
                </div>
                <p className="text-sm text-[var(--muted)]">{user.bio}</p>
                <div className="mt-2 text-xs text-[var(--muted)]">{user.email}</div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="flex items-center gap-2">
                <input 
                  id="avatar" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="max-w-xs px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" 
                />
                <button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] flex items-center gap-2"
                >
                  <Upload className="h-4 w-4"/>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold">{testResults.filter(t=>t.status==="Completed").length}</div>
                  <div className="text-xs text-[var(--muted)]">Tests done</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">{mockModules.filter(m=>m.progress===100).length}</div>
                  <div className="text-xs text-[var(--muted)]">Modules done</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">{mockBooks.filter(b=>b.status==="Completed").length}</div>
                  <div className="text-xs text-[var(--muted)]">Books read</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="grid grid-cols-7 gap-2 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "tests", label: "Tests", icon: BarChart3 },
              { id: "modules", label: "Modules", icon: Library },
              { id: "books", label: "Books", icon: Book },
              { id: "podcasts", label: "Podcasts", icon: Headphones },
              { id: "therapist", label: "Therapist", icon: Users },
              { id: "settings", label: "Settings", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="h-4 w-4"/>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Trait Profile</h3>
                  <div className="space-y-3">
                    {mockTraits.map((trait) => (
                      <div key={trait.dimension} className="flex items-center justify-between">
                        <span className="text-sm">{trait.dimension}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[var(--surface)] rounded-full h-2 border border-[var(--border)]">
                            <div 
                              className="bg-teal-600 h-2 rounded-full" 
                              style={{ width: `${trait.value}%` }}
                            />
                          </div>
                          <span className="text-sm text-[var(--muted)] w-8">{trait.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Score</span>
                      <span className="text-lg font-semibold">
                        {testResults.length > 0 
                          ? Math.round(testResults.reduce((sum, t) => sum + (t.score || 0), 0) / testResults.length)
                          : 0
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tests Completed</span>
                      <span className="text-lg font-semibold">{testResults.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Completion</span>
                      <span className="text-lg font-semibold">
                        {profile.fullName && profile.ageRange && profile.gender ? "100%" : "80%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {testResults.length > 0 ? testResults.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-xl text-xs ${
                          t.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {t.status}
                        </span>
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-[var(--muted)]">{t.date}</div>
                        </div>
                      </div>
                      <div className="text-sm text-[var(--muted)]">{t.score ? `Score: ${t.score}` : "—"}</div>
                    </div>
                  )) : (
                    <div className="text-center text-[var(--muted)] py-8">
                      No test results yet. Take your first test to see results here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TESTS */}
          {activeTab === "tests" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {testResults.map((test) => (
                  <div key={test.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{test.title}</h3>
                      <span className={`px-2 py-1 rounded-xl text-xs ${
                        test.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {test.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-[var(--muted)]">{test.date}</div>
                      <div className="w-full bg-[var(--surface)] rounded-full h-2 border border-[var(--border)]">
                        <div 
                          className="bg-teal-600 h-2 rounded-full" 
                          style={{ width: `${test.status === "Completed" ? 100 : 55}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Score: {test.score ?? "—"}</div>
                        <button className="px-3 py-1 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--surface)] flex items-center gap-1">
                          <BarChart3 className="h-4 w-4"/> View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => window.location.href = "/tests"}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4"/> Start new test
              </button>
            </div>
          )}

          {/* MODULES */}
          {activeTab === "modules" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {mockModules.map((m) => (
                  <div key={m.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{m.name}</h3>
                      <span className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs">
                        {m.tag}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{m.progress}%</span>
                      </div>
                      <div className="w-full bg-[var(--surface)] rounded-full h-2 border border-[var(--border)]">
                        <div 
                          className="bg-teal-600 h-2 rounded-full" 
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => window.location.href = "/modules"}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4"/> Explore modules
              </button>
            </div>
          )}

          {/* BOOKS */}
          {activeTab === "books" && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Library</h3>
              <div className="space-y-3">
                {mockBooks.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs">
                        {b.status}
                      </span>
                      <div className="font-medium">{b.title}</div>
                    </div>
                    <button className="px-3 py-1 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--surface)]">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PODCASTS */}
          {activeTab === "podcasts" && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Podcasts</h3>
              <div className="space-y-3">
                {mockPodcasts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-xl text-xs ${
                        p.listened ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {p.listened ? "Listened" : "Queued"}
                      </span>
                      <div className="font-medium">{p.title}</div>
                    </div>
                    <button className="px-3 py-1 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--surface)]">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THERAPIST */}
          {activeTab === "therapist" && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Your Therapist</h3>
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
                    <img src={mockTherapist.avatarUrl} alt="Therapist" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{mockTherapist.name}</div>
                    <div className="text-sm text-[var(--muted)]">{mockTherapist.specialty}</div>
                    <div className="mt-1 text-xs text-[var(--muted)]">{mockTherapist.email} • {mockTherapist.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                    <Users className="h-4 w-4"/> Book session
                  </button>
                  <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)]">
                    Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Profile</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      defaultValue={user.name} 
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      defaultValue={user.email} 
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea 
                      defaultValue={user.bio} 
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" 
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age Range</label>
                    <select 
                      defaultValue={profile.ageRange}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]"
                    >
                      <option value="">Select age range</option>
                      <option value="15-20">15 - 20</option>
                      <option value="20-25">20 - 25</option>
                      <option value="25-30">25 - 30</option>
                      <option value="30-35">30 - 35</option>
                      <option value="35-40">35 - 40</option>
                      <option value="40-45">40 - 45</option>
                      <option value="45-50">45 - 50</option>
                      <option value="50-60">50 - 60</option>
                      <option value="60+">60+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select 
                      defaultValue={profile.gender}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] flex items-center gap-2">
                      <Pencil className="h-4 w-4"/> Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Clear all data</div>
                    <div className="text-xs text-[var(--muted)]">Remove profile, test results, and preferences</div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Clear & Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}