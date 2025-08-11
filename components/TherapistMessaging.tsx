"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Send, 
  Paperclip, 
  Smile,
  Search,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "appointment" | "system";
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantType: "therapist" | "client";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: "active" | "consultation-pending" | "session-scheduled";
  consultationCode?: string;
}

export default function TherapistMessaging() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const conversations: Conversation[] = [
    {
      id: "1",
      participantId: "client-123",
      participantName: "Sarah Wilson",
      participantType: "client",
      lastMessage: "Thank you for the session today. I feel much better.",
      lastMessageTime: new Date("2024-01-20T15:30:00"),
      unreadCount: 0,
      status: "active",
      consultationCode: "SW-2024-REQ"
    },
    {
      id: "2",
      participantId: "client-456",
      participantName: "Ahmad Rezaei",
      participantType: "client",
      lastMessage: "Can we schedule a session for next week?",
      lastMessageTime: new Date("2024-01-20T14:15:00"),
      unreadCount: 2,
      status: "consultation-pending",
      consultationCode: "AR-2024-REQ"
    },
    {
      id: "3",
      participantId: "therapist-789",
      participantName: "Dr. Lisa Chen",
      participantType: "therapist",
      lastMessage: "I've reviewed the case study you shared. Very insightful approach.",
      lastMessageTime: new Date("2024-01-20T12:45:00"),
      unreadCount: 1,
      status: "active"
    }
  ];

  const messages: { [conversationId: string]: Message[] } = {
    "1": [
      {
        id: "msg-1",
        senderId: "client-123",
        senderName: "Sarah Wilson",
        content: "Hi Dr. Johnson, I wanted to follow up on our last session.",
        timestamp: new Date("2024-01-20T14:00:00"),
        type: "text",
        read: true
      },
      {
        id: "msg-2",
        senderId: "therapist-current",
        senderName: "Dr. Johnson",
        content: "Hello Sarah! I'm glad you reached out. How have you been feeling since we last spoke?",
        timestamp: new Date("2024-01-20T14:05:00"),
        type: "text",
        read: true
      },
      {
        id: "msg-3",
        senderId: "client-123",
        senderName: "Sarah Wilson",
        content: "Much better actually. The breathing exercises you taught me have been really helpful during anxiety episodes.",
        timestamp: new Date("2024-01-20T14:07:00"),
        type: "text",
        read: true
      },
      {
        id: "msg-4",
        senderId: "client-123",
        senderName: "Sarah Wilson",
        content: "Thank you for the session today. I feel much better.",
        timestamp: new Date("2024-01-20T15:30:00"),
        type: "text",
        read: true
      }
    ],
    "2": [
      {
        id: "msg-5",
        senderId: "client-456",
        senderName: "Ahmad Rezaei",
        content: "Hello, I got your consultation code from the directory. I would like to book a session.",
        timestamp: new Date("2024-01-20T13:30:00"),
        type: "text",
        read: true
      },
      {
        id: "msg-6",
        senderId: "system",
        senderName: "System",
        content: "New consultation request from Ahmad Rezaei (Code: AR-2024-REQ). Please review and respond.",
        timestamp: new Date("2024-01-20T13:31:00"),
        type: "system",
        read: false
      },
      {
        id: "msg-7",
        senderId: "client-456",
        senderName: "Ahmad Rezaei",
        content: "Can we schedule a session for next week?",
        timestamp: new Date("2024-01-20T14:15:00"),
        type: "text",
        read: false
      }
    ]
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Here you would send the message to your backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleScheduleAppointment = () => {
    setShowScheduleModal(true);
  };

  const selectedMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="h-[600px] flex bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-white">Messages</h3>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-slate-700/50 cursor-pointer transition-all ${
                selectedConversation === conversation.id ? "bg-slate-800 border-l-4 border-l-teal-500" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                    {conversation.participantType === "therapist" ? "👨‍⚕️" : "😊"}
                  </div>
                  {conversation.status === "consultation-pending" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm truncate">
                      {conversation.participantName}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {conversation.lastMessageTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 truncate mb-1">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      conversation.status === "active" 
                        ? "bg-green-900/30 text-green-400"
                        : conversation.status === "consultation-pending"
                        ? "bg-orange-900/30 text-orange-400"
                        : "bg-blue-900/30 text-blue-400"
                    }`}>
                      {conversation.status === "active" && "Active"}
                      {conversation.status === "consultation-pending" && "Pending"}
                      {conversation.status === "session-scheduled" && "Scheduled"}
                    </span>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                  {conversations.find(c => c.id === selectedConversation)?.participantType === "therapist" ? "👨‍⚕️" : "😊"}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {conversations.find(c => c.id === selectedConversation)?.participantName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {conversations.find(c => c.id === selectedConversation)?.participantType === "therapist" ? "Fellow Therapist" : "Client"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleScheduleAppointment}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Schedule Appointment"
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Video className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.senderId === "therapist-current" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-[70%] ${
                    message.type === "system" 
                      ? "w-full flex justify-center"
                      : ""
                  }`}>
                    {message.type === "system" ? (
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-center">
                        <p className="text-blue-300 text-sm">{message.content}</p>
                        <div className="flex gap-2 mt-2 justify-center">
                          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                            Accept
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-2xl p-3 ${
                        message.senderId === "therapist-current"
                          ? "bg-teal-600 text-white"
                          : "bg-slate-800 text-gray-200"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.senderId === "therapist-current" && (
                            <CheckCircle2 className="w-3 h-3 opacity-70" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-slate-800 rounded-lg border border-slate-600 focus-within:border-teal-500">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="px-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                        <Smile className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Appointment Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Schedule Appointment</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <select className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700">
                      <input type="radio" name="session-type" value="video" className="text-teal-500" />
                      <Video className="w-4 h-4 text-teal-400" />
                      <span className="text-white text-sm">Video</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700">
                      <input type="radio" name="session-type" value="voice" className="text-teal-500" />
                      <Phone className="w-4 h-4 text-teal-400" />
                      <span className="text-white text-sm">Voice</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

