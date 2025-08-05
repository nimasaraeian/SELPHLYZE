// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="text-center px-4 w-full font-sans">
        
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
          Selphlyze
        </h1>

        {/* Search Box */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Write whatever is on your mind..."
            className="w-3/4 max-w-5xl px-10 py-5 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl shadow-lg transition duration-300"
          />
        </div>
      </section>
    </main>
  );
}
