import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

interface HeroSectionProps {
  darkMode: boolean;
}

export default function HeroSection({ darkMode }: HeroSectionProps) {
  const handleOnClick = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      redirect("/dashboard");
    } else if (error || !data?.user) {
      redirect("/auth/register");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">
      <motion.h2
        className={`text-4xl md:text-6xl font-extrabold ${darkMode ? "text-[#f8f8f8]" : "text-[#FF7E67]"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 Your Next Adventure Starts Here
      </motion.h2>
      <p className="mt-4 text-lg md:text-xl max-w-2xl text-[#555]">
        Plan and explore the world like never before with AI-powered travel suggestions.
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant={`${darkMode ? "dakrModeMain" : "themeMain"}`}
          className="mt-6 px-6 py-3 bg-[#FFB86F] text-white rounded-2xl hover:bg-[#FF7E67] transition-all"
          onClick={handleOnClick}
        >
          🌴 Get Started Now
        </Button>
      </motion.div>
    </section>
  );
}
