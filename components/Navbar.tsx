import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
        <ul className="flex flex-wrap gap-8 text-lg font-medium text-gray-300">
          <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
          <li><Link href="/tests" className="hover:text-teal-400 transition-colors">Tests</Link></li>
          <li><Link href="/psychology" className="hover:text-teal-400 transition-colors">Psychology</Link></li>
          <li><Link href="/modules" className="hover:text-teal-400 transition-colors">Modules</Link></li>
          <li><Link href="/trappists" className="hover:text-teal-400 transition-colors">Trappists</Link></li>
          <li><Link href="/profile" className="hover:text-teal-400 transition-colors">Profile</Link></li>
          <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
