"use client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FaChartPie, FaMap, FaTrophy } from "react-icons/fa";
import TripCard from "./TripCard";
import { useEffect, useState } from "react";;
import { fetchTrips, fetchTripsFromFriends } from "@/utils/fetchTrips";
import { useDarkMode } from "@/hooks/useDarkMode";

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

export default function Dashboard({
  user,
  access_token,
  refresh_token,
}: DashboardProps) {
  const { darkMode } = useDarkMode();
  const userId = user?.id;
  const [trips, setTrips] = useState<
    {
      id: number;
      title: string;
      typeOfTrip: string;
      startDate: string;
      endDate: string;
      image: string | null;
      friendsList: { id: string; full_name: string }[];
      status?: string;
      owner: Owner;
    }[]
  >([]);
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
        const friendsTrips = await fetchTripsFromFriends();
        const allTrips = [...(userTrips || []), ...(friendsTrips || [])];
        setTrips(allTrips.slice(0, 4));
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
      <h1 className={`${darkMode ? "text-white" : "text-[#0077B6]"} font-bold text-3xl mb-6`}>
        🌴 Good Morning, {user_firstName} 👋
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <FaMap className="text-yellow-400 text-4xl" />,
            label: "Countries Visited",
            value: "12",
          },
          {
            icon: <FaTrophy className="text-amber-300 text-4xl" />,
            label: "Top Travel Companion",
            value: "Alex",
          },
          {
            icon: <FaChartPie className="text-purple-500 text-4xl" />,
            label: "AI Travel Score",
            value: "85%",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-6 bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg flex items-center space-x-4 ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
                : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
            }`}
          >
            {item.icon}
            <div>
              <p
                className={`text-lg font-semibold text-gray-700 ${
                  darkMode && "text-white"
                }`}
              >
                {item.label}
              </p>
              <p
                className={`text-2xl font-bold text-gray-900 ${
                  darkMode && "text-white"
                }`}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div
          className={`p-6 rounded-xl shadow-lg bg-opacity-30 backdrop-blur-lg ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
              : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            AI Travel Recommendations
          </h2>
          <ul className="space-y-3">
            {[
              "🚀 Japan - Perfect for culture & tech lovers",
              "🌴 Maldives - Best for relaxation & beaches",
              "🎢 Orlando, USA - Adventure & theme parks",
            ].map((rec, i) => (
              <li
                key={i}
                className={`p-4 rounded-lg shadow-md hover:scale-105 transition-transform ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                }`}
              >
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`p-6 rounded-2xl shadow-xl bg-opacity-40 backdrop-blur-lg transition-all duration-300 
  ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
      : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
  }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            🌤️ Weather at Your Next Destination
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start space-y-1">
              <p className="text-2xl font-bold">25°C</p>
              <p className="text-lg opacity-80">Paris, France</p>
              <p className="text-sm opacity-60">Sunny · Feels like 27°C</p>
            </div>
            <div className="text-6xl">☀️</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {[
              { day: "Mon", icon: "🌤️", temp: "23°C" },
              { day: "Tue", icon: "🌧️", temp: "18°C" },
              { day: "Wed", icon: "⛅", temp: "21°C" },
            ].map(({ day, icon, temp }) => {
              return (
                <div
                  key={day}
                  className={`rounded-lg py-2 px-3 shadow-md 
          ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                >
                  <p className="text-sm font-semibold">{day}</p>
                  <p className="text-xl">{icon}</p>
                  <p className="text-sm">{temp}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`p-6 rounded-xl shadow-lg bg-opacity-30 backdrop-blur-lg mt-6 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
            : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              image={trip.image || "/default-image.jpg"}
              friendsList={trip.friendsList || []}
              owner={trip.owner}
              darkMode={darkMode}
              onClick={() => {
                if(trip.status == "draft") {
                  router.push('/trip/creator?trip_id=' + trip.id);
                } else {
                  router.push(`/trip/${trip.id}`)
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
