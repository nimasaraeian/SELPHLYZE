"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const modules = [
  {
    name: "Synclyze",
    description: "Discover relationship harmony and sync with your partner.",
    color: "from-pink-500 to-rose-600",
    href: "/modules/synclyze",
  },
  {
    name: "Shadowlyze",
    description: "Explore the hidden layers of your shadow self.",
    color: "from-gray-700 to-gray-900",
    href: "/modules/shadowlyze",
  },
  {
    name: "Joblyze",
    description: "Find the career path that truly matches your personality.",
    color: "from-blue-500 to-indigo-600",
    href: "/modules/joblyze",
  },
];

export default function ModulesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-12">
          Explore Selphlyze Modules
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
          Dive into our specialized modules designed to unlock different layers
          of your psychology. Choose one to begin your journey.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => (
            <motion.div
              key={mod.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={mod.href}>
                <div
                  className={`rounded-2xl shadow-lg hover:shadow-2xl bg-gradient-to-r ${mod.color} p-8 h-56 flex flex-col justify-between text-white cursor-pointer`}
                >
                  <h2 className="text-2xl font-bold">{mod.name}</h2>
                  <p className="text-sm opacity-90">{mod.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
