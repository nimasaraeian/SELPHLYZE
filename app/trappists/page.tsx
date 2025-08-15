"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  Video, 
  Search, 
  Globe, 
  Calendar,
  Award,
  BookOpen,
  Heart,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import TherapistMessaging from "@/components/TherapistMessaging";
import VideoConsultation from "@/components/VideoConsultation";
import TherapistDashboard from "@/components/TherapistDashboard";

export default function TherapistsNetworkPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType, setUserType] = useState<"therapist" | "client" | null>(null);

  const therapistProfiles = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cognitive Behavioral Therapy",
      location: "New York, USA",
      rating: 4.9,
      experience: "8 years",
      languages: ["English", "Spanish"],
      avatar: "/avatars/therapist-1.jpg",
      consultationCode: "SJ-2024-NYC",
      price: "$120/session",
      available: true,
      credentials: ["PhD Psychology", "CBT Certified", "EMDR Specialist"]
    },
    {
      id: 2,
      name: "Dr. Ahmad Hosseini",
      specialty: "Family & Marriage Therapy",
      location: "Tehran, Iran",
      rating: 4.8,
      experience: "12 years",
      languages: ["Persian", "English", "Arabic"],
      avatar: "/avatars/therapist-2.jpg",
      consultationCode: "AH-2024-TEH",
      price: "$80/session",
      available: true,
      credentials: ["PhD Clinical Psychology", "Marriage Counselor", "Trauma Specialist"]
    },
    {
      id: 3,
      name: "Dr. Emma Rodriguez",
      specialty: "Child & Adolescent Psychology",
      location: "Barcelona, Spain",
      rating: 5.0,
      experience: "6 years",
      languages: ["Spanish", "English", "Catalan"],
      avatar: "/avatars/therapist-3.jpg",
      consultationCode: "ER-2024-BCN",
      price: "€90/session",
      available: false,
      credentials: ["MSc Child Psychology", "Play Therapy Certified", "Autism Specialist"]
    }
  ];

  const communityPosts = [
    {
      id: 1,
      author: "Dr. Michael Chen",
      specialty: "Anxiety Disorders",
      content: "New research on mindfulness-based interventions for panic disorder shows promising results. The combination of breathing techniques with cognitive restructuring appears to reduce symptom frequency by 65%. Interested in collaborating on a multi-site study?",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["research", "anxiety", "mindfulness"]
    },
    {
      id: 2,
      author: "Dr. Lisa Peterson",
      specialty: "Trauma Therapy",
      content: "Sharing a breakthrough moment: today a client who's been struggling with PTSD for 3 years finally felt safe enough to process their core trauma. The healing power of therapeutic alliance never ceases to amaze me. 💙",
      timestamp: "5 hours ago",
      likes: 156,
      comments: 32,
      tags: ["trauma", "healing", "breakthrough"]
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
          >
            Therapists Global Network
          </motion.h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Connect, collaborate, and grow with mental health professionals worldwide. 
            Share knowledge, find consultation opportunities, and expand your practice globally.
          </p>
        </header>

        {/* User Type Selection */}
        {!userType && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-teal-300">Join Our Community</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("therapist")}
                className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-center group hover:shadow-xl transition-all"
              >
                <Users className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">I'm a Therapist</h3>
                <p className="text-emerald-100 text-sm">
                  Join our professional network, share expertise, and connect with colleagues worldwide
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType("client")}
                className="p-6 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl text-center group hover:shadow-xl transition-all"
              >
                <Heart className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">I'm seeking Support</h3>
                <p className="text-blue-100 text-sm">
                  Find qualified therapists worldwide, book consultations, and begin your healing journey
                </p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        {userType && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: Award },
              { id: "discover", label: "Discover Therapists", icon: Search },
              { id: "community", label: "Community", icon: Users },
              { id: "messages", label: "Messages", icon: MessageCircle },
              { id: "consultation", label: "Live Session", icon: Video }
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
        )}

        {/* Content based on active tab */}
        {userType && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div>
                <TherapistDashboard />
              </div>
            )}

            {/* Discover Therapists Tab */}
            {activeTab === "discover" && (
              <div>
                <div className="mb-8">
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-teal-300">Global Therapist Directory</h2>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by specialty, location..."
                          className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <select className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
                        <option value="">All Specialties</option>
                        <option value="cbt">CBT</option>
                        <option value="trauma">Trauma Therapy</option>
                        <option value="family">Family Therapy</option>
                        <option value="child">Child Psychology</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {therapistProfiles.map((therapist) => (
                      <motion.div
                        key={therapist.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-teal-500/50 transition-all"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                            👨‍⚕️
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{therapist.name}</h3>
                            <p className="text-teal-300 text-sm mb-2">{therapist.specialty}</p>
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <MapPin className="w-3 h-3" />
                              {therapist.location}
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${therapist.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-white">{therapist.rating}</span>
                            <span className="text-gray-400">({therapist.experience})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Globe className="w-4 h-4" />
                            {therapist.languages.join(", ")}
                          </div>
                          <div className="text-sm text-teal-300 font-medium">{therapist.price}</div>
                        </div>

                        <div className="mb-4">
                          <div className="text-xs text-gray-400 mb-2">Credentials:</div>
                          <div className="flex flex-wrap gap-1">
                            {therapist.credentials.map((cred, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-xs text-gray-300">
                                {cred}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-gray-400">Consultation Code:</div>
                          <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg">
                            <code className="text-teal-300 font-mono text-sm flex-1">{therapist.consultationCode}</code>
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">Copy</button>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                            Book Session
                          </button>
                          <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Community Tab */}
            {activeTab === "community" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-teal-300">Therapist Community</h2>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    New Post
                  </button>
                </div>

                <div className="space-y-6">
                  {communityPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-lg">
                          👨‍⚕️
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{post.author}</h3>
                          <p className="text-teal-300 text-sm">{post.specialty}</p>
                          <p className="text-gray-400 text-xs">{post.timestamp}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-teal-900/30 text-teal-300 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <button className="flex items-center gap-2 hover:text-teal-300 transition-colors">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 hover:text-teal-300 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <button className="hover:text-teal-300 transition-colors">
                          Share
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <h2 className="text-2xl font-bold text-teal-300 text-center mb-8">Messages & Communication</h2>
                <TherapistMessaging />
              </div>
            )}

            {/* Live Session Tab */}
            {activeTab === "consultation" && (
              <div>
                <h2 className="text-2xl font-bold text-teal-300 text-center mb-8">Live Consultation Session</h2>
                <VideoConsultation />
              </div>
            )}

            {/* Legacy Consultation Tab (kept for compatibility) */}
            {activeTab === "book-consultation" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-teal-300 text-center mb-8">Book Your Consultation</h2>
                
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Therapist Consultation Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter therapist code (e.g., SJ-2024-NYC)"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Get this code from your selected therapist's profile
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preferred Time
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
                          <option value="">Select time</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="16:00">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Session Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                          <input type="radio" name="session-type" value="video" className="text-teal-500" />
                          <Video className="w-5 h-5 text-teal-400" />
                          <span className="text-white">Video Call</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                          <input type="radio" name="session-type" value="voice" className="text-teal-500" />
                          <Phone className="w-5 h-5 text-teal-400" />
                          <span className="text-white">Voice Call</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Brief Description (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us briefly what you'd like to discuss..."
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none resize-none"
                      ></textarea>
                    </div>

                    <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-105">
                      Request Consultation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-teal-300 text-center mb-8">
                  {userType === "therapist" ? "Therapist Profile" : "Client Profile"}
                </h2>
                
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                          {userType === "therapist" ? "👨‍⚕️" : "😊"}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {userType === "therapist" ? "Dr. Your Name" : "Your Name"}
                        </h3>
                        {userType === "therapist" && (
                          <p className="text-teal-300">Clinical Psychologist</p>
                        )}
                      </div>

                      {userType === "therapist" && (
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-teal-900/20 rounded-lg border border-teal-700">
                            <div className="text-xs text-gray-400 mb-1">Your Consultation Code</div>
                            <code className="text-teal-300 font-mono font-bold">YN-2024-LOC</code>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-slate-800 rounded-lg">
                              <div className="text-xl font-bold text-white">24</div>
                              <div className="text-xs text-gray-400">Clients</div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg">
                              <div className="text-xl font-bold text-white">4.9</div>
                              <div className="text-xs text-gray-400">Rating</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                      <h4 className="text-lg font-bold text-white mb-6">Profile Settings</h4>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                            <input
                              type="text"
                              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                            <input
                              type="text"
                              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {userType === "therapist" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Specializations</label>
                              <select className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
                                <option value="">Select primary specialization</option>
                                <option value="cbt">Cognitive Behavioral Therapy</option>
                                <option value="psychodynamic">Psychodynamic Therapy</option>
                                <option value="humanistic">Humanistic Therapy</option>
                                <option value="family">Family & Marriage Therapy</option>
                                <option value="trauma">Trauma & PTSD</option>
                                <option value="addiction">Addiction Counseling</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Session Rate</label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="120"
                                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                                />
                                <select className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
                                  <option value="usd">USD</option>
                                  <option value="eur">EUR</option>
                                  <option value="irr">IRR</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                              <textarea
                                rows={4}
                                placeholder="Tell potential clients about your approach and experience..."
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none resize-none"
                              ></textarea>
                            </div>
                          </>
                        )}

                        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
