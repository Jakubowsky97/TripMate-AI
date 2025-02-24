"use client";

import { useState } from "react";
import FeatureSection from "@/components/layout/feturesSection";
import HeroSection from "@/components/layout/heroSection";
import NavBar from "@/components/layout/navBar";
import HowItWorksSection from "@/components/layout/howItWorksSection";
import { useDarkMode } from "@/components/ui/DarkModeContext";

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`${darkMode ? "bg-[#070e0e] text-white" : "bg-[#f8f8f8] text-gray-900"} min-h-screen transition-colors duration-300`}>  
      {/* Navbar */}
      <NavBar darkMode={darkMode} setDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <HeroSection darkMode={darkMode} />

      {/* Features Section */}
      <FeatureSection darkMode={darkMode} />

      {/* How it works Section */}
      <HowItWorksSection darkMode={darkMode} />
    </div>
  );
}
