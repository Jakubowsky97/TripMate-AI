"use client";
import { motion } from "framer-motion";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import Chatbot from "@/components/ui/ChatBot";


export default function TripCreationFlow() {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#1a1e1f] text-white" : "bg-white text-black"}`}>
            <div className="max-w-4xl mx-auto p-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Chatbot/>
                </motion.div>   
            </div>
        </div>
    );
};