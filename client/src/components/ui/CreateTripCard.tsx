import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CreateTripCardProps {
    darkMode: boolean;
    onCreateTrip: () => void;
}

export default function CreateTripCard({ darkMode, onCreateTrip }: CreateTripCardProps) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
                className={`${
                    darkMode ? "bg-[#1a1e1f] text-white shadow-lg shadow-white/10 border-[#2D2D2D]" : "bg-white text-black"
                } rounded-3xl shadow-xl overflow-hidden transition-all transform hover:scale-105`}
            >
                <div className={`${darkMode ? "bg-[#2D2D2D]" : "bg-gray-200"} w-full h-60 flex items-center justify-center rounded-t-3xl`}>
                    <span className={`${darkMode ? "text-white" : "text-black"} text-2xl font-semibold`}>
                        Create a New Trip
                    </span>
                </div>
                <CardContent className="p-6">
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm mb-4`}>
                        Start planning your next adventure by creating a new trip!
                    </p>
                    <button
                        onClick={onCreateTrip}
                        className={`${
                            darkMode
                                ? "bg-[#4e73df] text-white hover:bg-[#2e59e5]"
                                : "bg-[#FF6347] text-white hover:bg-[#ff4500]"
                        } px-4 py-2 rounded-md font-semibold w-full mt-4 transition-colors`}
                    >
                        Create Trip
                    </button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
