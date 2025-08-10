"use client";
import { useState } from "react";
import { Search, Send } from "lucide-react";

export default function SimpleSearchBox() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Search:", query);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-hidden">
          <div className="pl-6 pr-4">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for psychology resources, tests, or therapists..."
            className="flex-1 px-4 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
          />
          <button
            onClick={handleSearch}
            className="mr-2 p-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-full transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
