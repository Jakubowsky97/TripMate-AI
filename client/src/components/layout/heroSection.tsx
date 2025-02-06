import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function HeroSection() {
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
          <Button variant="themeMain" className="mt-6 px-6 py-3">Get Started Now</Button>
        </motion.div>
      </section>
    )
}