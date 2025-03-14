import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FcCalendar } from "react-icons/fc";
import Image from "next/image";

interface TripCardProps {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    friendsList: string[];
    image: string;
    darkMode: boolean;  // Pass darkMode as a prop
}

export default function TripCard({
    title,
    destination,
    startDate,
    endDate,
    friendsList,
    image,
    darkMode,
}: TripCardProps) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
                className={`${
                    darkMode ? "bg-[#1a1e1f] text-white shadow-lg shadow-white/10 border-[#2D2D2D]" : "bg-[#f8f8f8] text-black"
                } rounded-3xl shadow-xl overflow-hidden transition-all transform hover:scale-105`}
            >
                <Image src={image} width={600} height={400} alt={title} className="w-full h-60 object-cover rounded-t-3xl" />
                <CardContent className="p-6">
                    <h3 className={`${darkMode ? "text-white" : "text-black"} text-2xl font-bold mb-2`}>
                        {title}
                    </h3>
                    <div className="flex items-center space-x-2">   
                        <FiMapPin/>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                            {destination}
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <FcCalendar/>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                            {startDate} - {endDate}
                        </p>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-2">
                    <FaUsers />
                        {friendsList.map((friend, idx) => (
                            <span
                                key={idx}
                                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}
                            >
                                {friend}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
