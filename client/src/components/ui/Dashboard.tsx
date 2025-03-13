"use client";
import { redirect, useSearchParams } from "next/navigation";
import { FaChartPie, FaMap, FaPlane, FaTrophy } from "react-icons/fa";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import TripCard from "./TripCard";
import { useEffect, useState } from "react";

interface DashboardProps {
  user: any;
  access_token: string;
  refresh_token: string;
}

const mockTrips = [
  {
    id: 1,
    title: "Trip to Paris",
    destination: "Paris, France",
    startDate: "2025-03-01",
    endDate: "2025-03-10",
    image: "https://www.cia-france.com/media/125/5_1100x700.jpg",
    friendsList: ["Alice", "Bob"],
  },
  {
    id: 2,
    title: "Trip to New York",
    destination: "New York, USA",
    startDate: "2025-04-15",
    endDate: "2025-04-20",
    image:
      "https://media.architecturaldigest.com/photos/5da74823d599ec0008227ea8/16:9/w_1280,c_limit/GettyImages-946087016.jpg",
    friendsList: ["Charlie", "Dave"],
  },
];

export default function Dashboard({ user, access_token, refresh_token }: DashboardProps) {
  const { darkMode } = useDarkMode();
  const [trips, setTrips] = useState(mockTrips);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

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
          <div key={index} className={`p-6 bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg flex items-center space-x-4 ${darkMode ? "bg-gray-800" : "bg-blue-100"}`}>
            {item.icon}
            <div>
              <p className="text-lg font-semibold text-gray-700">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
