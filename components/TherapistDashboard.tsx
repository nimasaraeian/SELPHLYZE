"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  Video,
  FileText,
  Bell,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  sessionsThisMonth: number;
  revenue: number;
  rating: number;
  responseTime: string;
}

interface Appointment {
  id: string;
  clientName: string;
  date: Date;
  duration: number;
  type: "video" | "voice";
  status: "upcoming" | "completed" | "cancelled";
}

export default function TherapistDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const stats: DashboardStats = {
    totalClients: 47,
    activeClients: 23,
    sessionsThisMonth: 89,
    revenue: 8950,
    rating: 4.9,
    responseTime: "< 2h"
  };

  const upcomingAppointments: Appointment[] = [
    {
      id: "1",
      clientName: "Sarah Wilson",
      date: new Date("2024-01-21T10:00:00"),
      duration: 60,
      type: "video",
      status: "upcoming"
    },
    {
      id: "2",
      clientName: "Ahmad Rezaei",
      date: new Date("2024-01-21T14:30:00"),
      duration: 45,
      type: "voice",
      status: "upcoming"
    },
    {
      id: "3",
      clientName: "Maria Garcia",
      date: new Date("2024-01-21T16:00:00"),
      duration: 60,
      type: "video",
      status: "upcoming"
    }
  ];

  const recentActivity = [
    { id: 1, type: "session", message: "Completed session with Sarah Wilson", time: "2 hours ago" },
    { id: 2, type: "message", message: "New message from Ahmad Rezaei", time: "4 hours ago" },
    { id: 3, type: "booking", message: "New booking request from Maria Garcia", time: "6 hours ago" },
    { id: 4, type: "review", message: "Received 5-star review from John Smith", time: "1 day ago" }
  ];

  const weeklySessionData = [
    { day: "Mon", sessions: 3 },
    { day: "Tue", sessions: 5 },
    { day: "Wed", sessions: 2 },
    { day: "Thu", sessions: 4 },
    { day: "Fri", sessions: 6 },
    { day: "Sat", sessions: 1 },
    { day: "Sun", sessions: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Welcome back, Dr. Johnson</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Users, label: "Total Clients", value: stats.totalClients, change: "+12%", color: "blue" },
          { icon: Activity, label: "Active Clients", value: stats.activeClients, change: "+8%", color: "green" },
          { icon: Calendar, label: "Sessions", value: stats.sessionsThisMonth, change: "+15%", color: "purple" },
          { icon: DollarSign, label: "Revenue", value: `$${stats.revenue}`, change: "+22%", color: "emerald" },
          { icon: Star, label: "Rating", value: stats.rating, change: "+0.1", color: "yellow" },
          { icon: Clock, label: "Response Time", value: stats.responseTime, change: "-30min", color: "cyan" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className={`text-xs text-${stat.color}-400 font-medium`}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Session Analytics */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Weekly Sessions</h3>
            <BarChart3 className="w-5 h-5 text-teal-400" />
          </div>
          <div className="h-64 flex items-end justify-between gap-3">
            {weeklySessionData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-500 hover:from-teal-500 hover:to-teal-300"
                  style={{ height: `${(data.sessions / 6) * 200 + 20}px` }}
                ></div>
                <span className="text-sm text-gray-400">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Today's Schedule</h3>
            <Calendar className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-teal-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{appointment.clientName}</h4>
                  <div className="flex items-center gap-1">
                    {appointment.type === "video" ? (
                      <Video className="w-4 h-4 text-blue-400" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>{appointment.duration} min</span>
                </div>
              </motion.div>
            ))}
            <button className="w-full py-2 text-center text-teal-400 hover:text-teal-300 text-sm transition-colors">
              View Full Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "session" ? "bg-green-400" :
                  activity.type === "message" ? "bg-blue-400" :
                  activity.type === "booking" ? "bg-yellow-400" :
                  "bg-purple-400"
                }`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Schedule Session", color: "blue" },
              { icon: MessageCircle, label: "Send Message", color: "green" },
              { icon: FileText, label: "Create Note", color: "purple" },
              { icon: Users, label: "View Clients", color: "cyan" }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-${action.color}-500/50 transition-all group`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-white text-sm">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

