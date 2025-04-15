"use client";
import { motion } from "framer-motion";
import Chatbot from "@/components/ui/ChatBot";
import { useDarkMode } from "@/hooks/useDarkMode";
import { checkSessionOrRedirect } from "@/app/auth/actions";
import { useEffect } from "react";

export default function TripCreationFlow() {
  const access_token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const refresh_token = typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null;

    useEffect(() => {
        const checkSession = async () => {
             await checkSessionOrRedirect({ accessToken: access_token || "", refreshToken: refresh_token || "" });
        }
        checkSession();
    }, [access_token, refresh_token]);
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
