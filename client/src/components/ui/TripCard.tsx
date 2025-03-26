import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FaUser, FaUsers } from "react-icons/fa";
import { FcCalendar, FcFolder } from "react-icons/fc";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";

interface TripCardProps {
  title: string;
  typeOfTrip: string;
  startDate: string;
  endDate: string;
  friendsList: { id: string; full_name: string }[];
  owner: Owner;
  image: string;
  darkMode: boolean; // Pass darkMode as a prop
  onClick: () => void;
}

interface Owner {
  id: string; // Unikalny identyfikator właściciela
  full_name: string; // Pełne imię i nazwisko właściciela
  username: string; // Nazwa użytkownika
  email: string; // Adres e-mail właściciela
  avatar_url: string; // Ścieżka do zdjęcia profilowego
  isConfirmed: boolean; // Status potwierdzenia właściciela
  updated_at: string; // Data ostatniej aktualizacji
}

export default function TripCard({
  onClick,
  title,
  typeOfTrip,
  startDate,
  endDate,
  friendsList,
  owner,
  image,
  darkMode,
}: TripCardProps) {
  const supabase = createClient();
  const [ownerAvatar, setOwnerAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerAvatar = async () => {
      const { data: avatarData, error } = await supabase.storage
        .from("avatars")
        .download(owner.avatar_url);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(avatarData);
      setOwnerAvatar(url);
    };
    fetchOwnerAvatar();
  }, [owner.avatar_url]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick}>
      <Card
        className={`${
          darkMode
            ? "bg-[#1a1e1f] text-white shadow-lg shadow-white/10 border-[#2D2D2D]"
            : "bg-[#f8f8f8] text-black"
        } rounded-3xl shadow-xl overflow-hidden transition-all transform hover:scale-105`}
      >
        <Image
          src={image}
          width={600}
          height={400}
          alt={title}
          className="w-full h-60 object-cover rounded-t-3xl"
        />
        <CardContent className="p-6">
          <h3
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-2xl font-bold mb-2`}
          >
            {title}
          </h3>
          <div className="mb-2 flex items-center space-x-2 text-[#6b7280]">
            <FaUser />
            <span
              className={`${
                darkMode ? "text-gray-300" : "text-[#6b7280]"
              } text-sm font-medium`}
            >
              Owner:
            </span>
            <Image
              src={ownerAvatar || "/default.png"}
              alt="Avatar"
              width={30}
              height={30}
              className="avatar rounded-full w-6 h-6"
            />
            <span
              className={`${
                darkMode ? "text-gray-300" : "text-black"
              } text-sm font-medium`}
            >
              {owner.full_name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <FcCalendar />
            <p
              className={`${
                darkMode ? "text-gray-300" : "text-gray-600"
              } text-sm`}
            >
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </p>
          </div>

          <div className="flex flex-row justify-between mt-3">
            <div className="flex items-center space-x-2">
              <FcFolder />
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                {typeOfTrip}
              </p>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                darkMode ? "text-gray-300" : "text-[#6b7280]"
              }`}
            >
              <FaUsers className="text-[#6b7280]" />
              {friendsList.length > 0 ? (
                <span className="text-sm">
                  {friendsList.length > 1
                    ? `${friendsList.length} friends`
                    : `${friendsList.length} friend`}
                </span>
              ) : (
                <span className={`${darkMode ? "text-gray-300" : "text-[#6b7280]"} text-sm`}>
                  No friends in this trip
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
