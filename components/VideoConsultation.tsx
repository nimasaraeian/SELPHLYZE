"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MessageCircle,
  Settings,
  Users,
  Clock,
  FileText,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from "lucide-react";

interface ConsultationSession {
  id: string;
  clientName: string;
  startTime: Date;
  duration: number; // in minutes
  sessionType: "video" | "voice";
  status: "waiting" | "active" | "ended";
}

export default function VideoConsultation() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const clientVideoRef = useRef<HTMLVideoElement>(null);

  const currentSession: ConsultationSession = {
    id: "session-123",
    clientName: "Sarah Wilson",
    startTime: new Date(),
    duration: 60,
    sessionType: "video",
    status: "active"
  };

  const chatMessages = [
    { id: 1, sender: "client", message: "Thank you for taking the time today", timestamp: new Date() },
    { id: 2, sender: "therapist", message: "Of course! How are you feeling today?", timestamp: new Date() }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const endSession = () => {
    // Here you would handle session ending logic
    console.log("Ending session");
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    // Handle sending chat message
    console.log("Sending message:", chatMessage);
    setChatMessage("");
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-slate-900 rounded-2xl overflow-hidden border border-slate-700`}>
      {/* Session Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Session with {currentSession.clientName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <FileText className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <MessageCircle className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-slate-950">
          {/* Client Video (Main) */}
          <div className="w-full h-full relative">
            {currentSession.sessionType === "video" ? (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                    😊
                  </div>
                  <p className="text-white text-lg font-medium">{currentSession.clientName}</p>
                  <p className="text-gray-400 text-sm">Video Active</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Mic className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium">{currentSession.clientName}</p>
                  <p className="text-gray-400 text-sm">Voice Only</p>
                </div>
              </div>
            )}

            {/* Therapist Video (Picture-in-Picture) */}
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 300, top: 0, bottom: 400 }}
              className="absolute top-4 right-4 w-48 h-36 bg-slate-800 rounded-lg border-2 border-slate-600 overflow-hidden cursor-move"
            >
              {isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍⚕️</div>
                    <p className="text-white text-xs">You</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </motion.div>

            {/* Screen Share Indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Screen Sharing
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4 border border-slate-600">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  isAudioOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Monitor className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={endSession}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>

              <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {(showChat || showNotes) && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              className="bg-slate-800 border-l border-slate-700 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {/* Panel Header */}
                <div className="p-4 border-b border-slate-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowChat(true)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        showChat ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setShowNotes(true)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        showNotes ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Notes
                    </button>
                  </div>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-hidden">
                  {showChat && (
                    <div className="h-full flex flex-col">
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'therapist' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              msg.sender === 'therapist' 
                                ? 'bg-teal-600 text-white' 
                                : 'bg-slate-700 text-gray-200'
                            }`}>
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-slate-700">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 text-sm focus:border-teal-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                          />
                          <button
                            onClick={sendChatMessage}
                            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm transition-colors"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showNotes && (
                    <div className="h-full p-4">
                      <textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="Session notes..."
                        className="w-full h-full bg-slate-700 border border-slate-600 rounded p-3 text-white placeholder-gray-400 text-sm resize-none focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

