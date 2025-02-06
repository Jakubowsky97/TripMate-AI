"use client";

import { useState } from "react";
import FeatureSection from "@/components/layout/feturesSection";
import HeroSection from "@/components/layout/heroSection";
import NavBar from "@/components/layout/navBar";
import HowItWorksSection from "@/components/layout/howItWorksSection";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-[#f8f8f8] text-gray-900"} min-h-screen transition-colors]`}>  
      {/* Navbar */}
      <NavBar  darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* How it works Section */}
      <HowItWorksSection />
    </div>
  );
}
