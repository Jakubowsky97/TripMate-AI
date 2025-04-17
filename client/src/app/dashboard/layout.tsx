"use client";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaMoon, FaSun, FaHome, FaMap, FaCog, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";
import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Providers } from "@/store/providers";
import { logout } from "../auth/actions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <LayoutContent>{children}</LayoutContent>
    </Providers>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [supabase, setSupabase] = useState<any>(null); 
  
  useEffect(() => {
    setSupabase(createClient());
    if(document.body.clientWidth > 768) setIsOpen(true);
  }, []); 

  const handleSignOut = async () => {
    localStorage.removeItem("user_id");
    logout();
  };  

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#121212] text-white" : "bg-[#fefaee] text-[#f8f8f8]"}`}>
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full ${isOpen ? "w-64" : "w-16 items-center"} transition-all duration-300 ${darkMode ? "bg-[#1a1e1f] border-r border-[#2D2D2D]" : "bg-gradient-to-b from-[#FFB703] to-[#FF7F50]"} shadow-md flex flex-col `}>
        
        {/* Sidebar Header */}
        <div className="p-4 items-center justify-between hidden md:flex">
          {isOpen && <h2 className="text-lg font-bold">TripMate AI</h2>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-2">
          <Link href={`/dashboard`} className={`flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded`}>
            <FaHome className={`${isOpen ? "mr-3" : "mr-0"} `} /> {isOpen && "Dashboard"}
          </Link>
          <Link href={`/dashboard/trips`} className="flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded">
            <FaMap className={`${isOpen ? "mr-3" : "mr-0"}`} /> {isOpen && "My Trips"}
          </Link>
          <Link href={`/dashboard/settings`} className="flex items-center p-3 transition-colors duration-300 hover:bg-[#4B5563] rounded">
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
      <main className={`flex-1 h-full p-6 ${isOpen ? "ml-64" : "ml-16"} transition-colors duration-300 text-[#070e0e] ${darkMode && "text-[#f8f8f8]"}`}>
        {children}
      </main>
    </div>
  );
}
