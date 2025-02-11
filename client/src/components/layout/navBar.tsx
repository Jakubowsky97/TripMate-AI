import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

interface NavBarProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  }

export default function NavBar({darkMode, setDarkMode} : NavBarProps) {
  const handleOnClick = async () => {
      const supabase = await createClient()
    
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        redirect('/dashboard');
      } else if (error || !data?.user) {
        redirect('/auth/register');
      }
  }

    return(
              <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">TripMate AI</h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-between items-center gap-5">
                    <Button variant="themeMainWhite" className="px-6 py-3 text-lg font-extralight hidden sm:block" onClick={handleOnClick}>Start Planning</Button>
                    <Button variant="ghost" className={`${darkMode ? "text-[#f8f8f8] hover:text-gray-900 hover:bg-[#f8f8f8]" : "border-0 hover:bg-[#f1f5f9] hover:text-gray-900"}`} onClick={() => setDarkMode(!darkMode)}>
                      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                </motion.div>
              </nav>
    )
}