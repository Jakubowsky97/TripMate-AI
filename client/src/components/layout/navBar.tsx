import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { FaSun, FaMoon } from "react-icons/fa";

interface NavBarProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  }

export default function NavBar({darkMode, setDarkMode} : NavBarProps) {
  const handleOnClick = async () => {
      const supabase = await createClient()
    
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        redirect('/dashboard?user_id=' + data.user.id);
      } else if (error || !data?.user) {
        redirect('/auth/login');
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
                    <button className={`${darkMode ? "bg-[#1a1e1f]" : "bg-[#142F32]"} text-[#f8f8f8] px-6 py-3 text-lg font-extralight rounded-3xl focus:outline-none transition duration-200 hidden sm:block`} onClick={handleOnClick}>Dashboard</button>
                    <Button variant="ghost" className={`${darkMode ? "hover:bg-[#1a1e1f]" : "border-0 hover:bg-[#142F32] hover:text-gray-900"}`} onClick={() => setDarkMode(!darkMode)}>
                      {darkMode ? <FaSun size={24} className="text-yellow-400"/> : <FaMoon size={24} />}
                    </Button>
                </motion.div>
              </nav>
    )
}