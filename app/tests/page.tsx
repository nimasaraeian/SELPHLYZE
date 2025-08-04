"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { testCategories } from "../../data/tests";
import { motion } from "framer-motion";

export default function TestsPage() {
  const [showModal, setShowModal] = useState(false);
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [displayName, setDisplayName] = useState(""); // اسم دلخواه
  const [selectedTest, setSelectedTest] = useState("");
  const router = useRouter();

  const isComplete = ageRange && gender && country;

  // وقتی روی دکمه تست کلیک بشه
  const startTest = (testUrl: string) => {
    console.log("Start Test Clicked!", testUrl);
    setSelectedTest(testUrl);
    setShowModal(true); // همیشه مودال باز بشه
    console.log("Modal should now be visible!");
  };

  // وقتی فرم مودال پر شد
  const handleContinue = () => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ageRange, gender, country, displayName })
    );
    setShowModal(false);
    console.log("User info saved, redirecting to:", selectedTest);
    router.push(selectedTest);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-20 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Explore Our AI-Powered Tests
        </h1>

        {testCategories.map((cat, index) => (
          <section key={index} className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-teal-300">
              {cat.category}
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {cat.tests.map((test, idx) => (
                <div
                  key={idx}
                  className="group bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border border-gray-700 hover:border-teal-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col"
                >
                  {/* Image */}
                  <div className="mb-6 overflow-hidden rounded-2xl flex justify-center">
                    <Image
                      src={test.image}
                      alt={test.title}
                      width={300}
                      height={450}
                      className="object-cover w-full h-[450px] group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-200 group-hover:text-teal-300 transition-colors text-center">
                    {test.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 text-lg leading-relaxed text-center">
                    {test.description}
                  </p>

                  {/* Start Test Button */}
                  <button
                    onClick={() =>
                      startTest(
                        `/tests/${test.title
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^\w-]+/g, "")}`
                      )
                    }
                    className="mt-auto inline-block px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:from-teal-400 hover:to-blue-400 transition-all text-center"
                  >
                    Start Test →
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md text-gray-800 shadow-2xl"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/image/SELPHLYZE_LOGO.png" // مسیر لوگوی Selphlyze
                alt="Selphlyze Logo"
                width={90}
                height={90}
                className="rounded-full"
              />
            </div>

            <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
              Before You Begin 🌱
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Please answer these quick questions to personalize your journey.
            </p>

            {/* Display Name */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Choose Your Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter any name you like"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-sm text-gray-400 mt-1">
                This name is just for fun — choose anything you like ✨
              </p>
            </div>

            {/* Age Range */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Age Range</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your age range</option>
                <option value="15-20">15 - 20</option>
                <option value="20-25">20 - 25</option>
                <option value="25-30">25 - 30</option>
                <option value="30-40">30 - 40</option>
                <option value="40-50">40 - 50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your gender</option>
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your country</option>
                <option value="usa">United States</option>
                <option value="canada">Canada</option>
                <option value="germany">Germany</option>
                <option value="turkey">Turkey</option>
                <option value="iran">Iran</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              disabled={!isComplete}
              onClick={handleContinue}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isComplete
                  ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
