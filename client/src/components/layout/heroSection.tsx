import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

interface HeroSectionProps {
  darkMode: boolean;
}

export default function HeroSection({ darkMode } : HeroSectionProps) {
  const handleOnClick = async () => {
      const supabase = await createClient()
    
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        redirect('/dashboard?user_id=' + data.user.id);
      } else if (error || !data?.user) {
        redirect('/auth/register');
      }
  }

    return(
        <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <motion.h2
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Plan Your Next Adventure with AI
        </motion.h2>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-[#777C90]">
          Effortlessly create, manage, and optimize your trips with AI-powered recommendations.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant={`${darkMode ? "dakrModeMain" : "themeMain"}`} className="mt-6 px-6 py-3" onClick={handleOnClick}>Get Started Now</Button>
        </motion.div>
      </section>
    )
}