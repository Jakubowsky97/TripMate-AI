"use client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FaChartPie, FaMap, FaPlane, FaTrophy } from "react-icons/fa";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import TripCard from "./TripCard";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchTrips, fetchTripsFromFriends } from "@/utils/fetchTrips";

interface DashboardProps {
  user: any;
  access_token: string;
  refresh_token: string;
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


export default function Dashboard({ user, access_token, refresh_token }: DashboardProps) {
  const { darkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const supabase = createClient();
  const [trips, setTrips] = useState<{
    id: number;
    title: string;
    typeOfTrip: string;
    startDate: string;
    endDate: string;
    image: string | null;
    friendsList: { id: string; full_name: string }[];
    owner: Owner;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!userId) {
          throw new Error("User ID is required to fetch trips");
        }
        const userTrips = await fetchTrips(userId);
        const friendsTrips = await fetchTripsFromFriends(userId);
        setTrips([...(userTrips || []), ...(friendsTrips || [])]);
      } catch (err) {
        setError("Failed to fetch trips");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    }
  }, [access_token, refresh_token]);

  if (!user) {
    redirect("/auth/login");
    return null;
  }

  const user_firstName = user.user_metadata.full_name.split(" ")[0];

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-6 text-[#0077B6]">🌴 Good Morning, {user_firstName} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          icon: <FaMap className="text-yellow-400 text-4xl" />, label: "Countries Visited", value: "12" },
          { icon: <FaTrophy className="text-amber-300 text-4xl" />, label: "Top Travel Companion", value: "Alex" },
          { icon: <FaChartPie className="text-purple-500 text-4xl" />, label: "AI Travel Score", value: "85%" }].map((item, index) => (
          <div key={index} className={`p-6 bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg flex items-center space-x-4 ${darkMode ? "bg-gray-800 " : "bg-blue-100"}`}>
            {item.icon}
            <div>
              <p className={`text-lg font-semibold text-gray-700 ${darkMode && "text-white"}`}>{item.label}</p>
              <p className={`text-2xl font-bold text-gray-900 ${darkMode && "text-white"}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className={`p-6 rounded-xl shadow-lg bg-opacity-30 backdrop-blur-lg ${darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"}`}>
          <h2 className="text-xl font-semibold mb-4">AI Travel Recommendations</h2>
          <ul className="space-y-3">
            {["🚀 Japan - Perfect for culture & tech lovers", "🌴 Maldives - Best for relaxation & beaches", "🎢 Orlando, USA - Adventure & theme parks"].map((rec, i) => (
              <li key={i} className={`p-4 rounded-lg shadow-md hover:scale-105 transition-transform ${darkMode ? "bg-gray-700" : "bg-white text-gray-900"}`}>{rec}</li>
            ))}
          </ul>
        </div>

        {/*TODO: Sprawdzać najbliższą wycieczkę z bazy, sprawdzać dla tych miast/miasta pogode 
        i wyswietlac 3 najbliższe dni w tym miescie*/}

        <div className={`p-6 rounded-xl shadow-lg bg-opacity-30 backdrop-blur-lg ${darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"}`}>
          <h2 className="text-xl font-semibold mb-4">Weather at Your Next Destination</h2>
          <div className="text-center">
            <p className="text-4xl">☀️</p>
            <p className="text-2xl font-bold">25°C</p>
            <p className="text-lg">Paris, France</p>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg bg-opacity-30 backdrop-blur-lg mt-6 ${darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"}`}>
        <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} image={trip.image || "/default-image.jpg"} friendsList={trip.friendsList || []} owner={trip.owner} darkMode={darkMode} onClick={() => router.push(`/trip/${trip.id}?user_id=${userId}`)}/>
          ))}
        </div>
      </div>
    </div>
  );
}
