"use client";
import { motion } from "framer-motion";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import Chatbot from "@/components/ui/ChatBot";

export default function TripCreationFlow() {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-[#131a29] to-[#1e2836]"
          : "bg-gradient-to-b from-[#f0f9ff] to-[#fffbeb]"
      }`}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Chatbot />
      </motion.div>
    </div>
  );
}
