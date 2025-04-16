"use client";
import { motion } from "framer-motion";
import Chatbot from "@/components/ui/ChatBot";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function TripCreationFlow() {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={` ${
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
