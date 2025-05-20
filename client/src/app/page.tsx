"use client";
import FeatureSection from "@/components/layout/featuresSection";
import HeroSection from "@/components/layout/heroSection";
import NavBar from "@/components/layout/navBar";
import HowItWorksSection from "@/components/layout/howItWorksSection";
import ImageCarousel from "@/components/layout/imageCarousel";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`${darkMode ? "bg-[#070e0e] text-white" : "bg-[#fefaee] text-gray-900"} min-h-screen transition-colors duration-300 overflow-x-hidden`}
    >
      {/* Navbar */}
      <NavBar darkMode={darkMode} setDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <HeroSection darkMode={darkMode} />

      <ImageCarousel />

      {/* Features Section */}
      <FeatureSection darkMode={darkMode} />

      {/* How it works Section */}
      <HowItWorksSection darkMode={darkMode} />
    </div>
  );
}