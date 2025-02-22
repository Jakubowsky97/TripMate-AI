"use client";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUser, FaMoon, FaSun, FaHome, FaMap, FaCog, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";
import { DarkModeProvider, useDarkMode } from "@/components/ui/DarkModeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <LayoutContent>{children}</LayoutContent>
    </DarkModeProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(true);
  const [supabase, setSupabase] = useState<any>(null); 
  const router = useRouter();
  
  useEffect(() => {
    setSupabase(createClient());
  }, []); 

  const handleSignOut = () => {
    const { error } = supabase.auth.signOut();
    if (!error) router.push("/");
  };  

  return (
    <div className={`flex h-screen  transition-colors duration-300 ${darkMode ? "bg-[#070e0e] text-white" : "bg-[#f8f8f8] text-[#f8f8f8]"}`}>
      
      {/* Sidebar */}
      <aside className={`h-full ${isOpen ? "w-64" : "w-16 items-center"} transition-all duration-300 ${darkMode ? "bg-[#1a1e1f] border-r border-[#2D2D2D]" : "bg-[#122C26]"} shadow-md flex flex-col `}>
        
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {isOpen && <h2 className="text-lg font-bold">TripMate AI</h2>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-2">
          <Link href="/dashboard" className={`flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded`}>
            <FaHome className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "Dashboard"}
          </Link>
          <Link href="/trips" className="flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded">
            <FaMap className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "My Trips"}
          </Link>
          <Link href="/dashboard/settings" className="flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded">
            <FaCog className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "Settings"}
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 flex flex-col space-y-2">
          <button onClick={toggleDarkMode} className="flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded">
            {darkMode ? <FaSun className={`${isOpen ? "mr-3" : "mr-0"} text-yellow-400`} /> : <FaMoon className={`${isOpen ? "mr-3" : "mr-0"}`} />}
            {isOpen && "Dark Mode"}
          </button>

            <button className="flex items-center p-3 transition-colors duration-300 hover:bg-red-600 rounded" onClick={handleSignOut}>
                <FaSignOutAlt className={`${isOpen ? "mr-3" : "mr-0"}`}  /> {isOpen && "Sign Out"}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-6 transition-colors duration-300 text-[#070e0e] ${darkMode && "text-[#f8f8f8]"}`}>
        {children}
      </main>
    </div>
  );
}
