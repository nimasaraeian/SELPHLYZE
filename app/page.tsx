// app/page.tsx
import Image from "next/image";
import AISearchChat from "@/components/AISearchChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="text-center px-4 w-full font-sans max-w-6xl mx-auto">
        
        {/* Logo with Glow */}
        <div className="mb-8 relative flex justify-center">
          {/* Glow Effect */}
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 blur-3xl opacity-40 animate-pulse"></div>

          {/* Logo */}
          <Image
            src="/image/SELPHLYZE_LOGO.png"
            alt="Selphlyze Logo"
            width={280}
            height={280}
            className="mx-auto drop-shadow-2xl relative z-10"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-10 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
          
        </h1>

        {/* AI Search & Chat Component */}
        <AISearchChat />

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Powered by artificial intelligence, I can help you find the right psychological resources, 
            connect with therapists, or guide you through self-assessment tools.
          </p>
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Assistant Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Multi-language Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
