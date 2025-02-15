"use client";
import { useState } from "react";
import { FaBars, FaTimes, FaUser, FaMoon, FaSun, FaHome, FaMap, FaCog, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => { 
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  }

  return (
    <div className={`flex h-screen ${darkMode ? "bg-[#070e0e] text-white" : "bg-[#f8f8f8] text-[#f8f8f8]"}`}>
      
      {/* Sidebar */}
      <aside className={`h-full ${isOpen ? "w-64" : "w-16 items-center"} transition-all duration-300 ${darkMode ? "bg-[#1a1e1f]" : "bg-[#142F32]"} shadow-md flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {isOpen && <h2 className="text-lg font-bold">TripMate AI</h2>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-2">
          <Link href="/dashboard" className={`flex items-center p-3 hover:bg-gray-700 rounded`}>
            <FaHome className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "Dashboard"}
          </Link>
          <Link href="/trips" className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <FaMap className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "My Trips"}
          </Link>
          <Link href="/preferences" className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <FaCog className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "Preferences"}
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 flex flex-col space-y-2">
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            {darkMode ? <FaSun className={`${isOpen ? "mr-3" : "mr-0"} text-yellow-400`} /> : <FaMoon className={`${isOpen ? "mr-3" : "mr-0"}`} />}
            {isOpen && "Dark Mode"}
          </button>

            <button className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" onClick={handleSignOut}>
                <FaSignOutAlt className={`${isOpen ? "mr-3" : "mr-0"}`}  /> {isOpen && "Sign Out"}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 text-[#070e0e]">
        {children}
      </main>
    </div>
  );
}
