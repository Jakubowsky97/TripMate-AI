"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-[#f8f8f8] text-gray-900"} min-h-screen transition-colors`}>  
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">TripMate AI</h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-between items-center gap-5">
            <Button variant="solid" className="px-6 py-3 text-lg">Start Planning</Button>
            <Button variant="ghost" className={`${darkMode ? "text-[#f8f8f8] hover:text-gray-900 hover:bg-[#f8f8f8]" : "border-0 hover:bg-[#f1f5f9] hover:text-gray-900"}`} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
        </motion.div>
          
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <motion.h2
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Plan Your Next Adventure with AI
        </motion.h2>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Effortlessly create, manage, and optimize your trips with AI-powered recommendations.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button className="mt-6 px-6 py-3 text-lg">Get Started Now</Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-semibold">Why TripMate AI?</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          {[
            "AI-powered itinerary planning",
            "Interactive map & route optimization",
            "Group trip collaboration",
            "Expense tracking & budgeting",
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h4 className="text-xl font-medium">{feature}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
