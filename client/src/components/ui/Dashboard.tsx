"use client";
import { redirect, useSearchParams } from "next/navigation";
import { FaChartPie, FaMap, FaPlane, FaTrophy } from "react-icons/fa";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import TripCard from "./TripCard";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface DashboardProps {
  user: any;
  access_token: string;
  refresh_token: string;
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
    friendsList: string[] | null;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/getLatestTrips/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
    
        if (data && data.data) {
          const mappedTrips = await Promise.all(
            data.data.map(async (item: any) => {
              let imageUrl = null;
              const imagePath = item.travel_data.image ? `${userId}/${item.travel_data.image}` : null;
    
              if (imagePath) {
                // Generate a signed URL only if the image exists
                const { data: signedUrlData, error: signedUrlError } = await supabase
                  .storage
                  .from("trip-images/user-images")
                  .createSignedUrl(imagePath, 60); // 60 seconds validity
    
                if (signedUrlError) {
                  console.error("Error getting signed URL:", signedUrlError);
                } else {
                  imageUrl = signedUrlData.signedUrl;
                }
              }
    
              return {
                id: item.travel_data.id,
                title: item.travel_data.title,
                typeOfTrip: item.travel_data.type_of_trip || "No type specified",
                startDate: item.travel_data.start_date,
                endDate: item.travel_data.end_date,
                image: imageUrl || "/default-image.jpg",  // Fallback to a default image if none exists
                friendsList: item.travel_data.friends_list || [],
              };
            })
          );
    
          console.log(mappedTrips);
          setTrips(mappedTrips);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    

    fetchTrips();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} image={trip.image || "/default-image.jpg"} friendsList={trip.friendsList || []} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
