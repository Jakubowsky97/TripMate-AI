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

export default function Dashboard({
  user,
  access_token,
  refresh_token,
}: DashboardProps) {
  const { darkMode } = useDarkMode();

  const [trips, setTrips] = useState<
    {
      id: number;
      title: string;
      destination: string;
      startDate: string;
      endDate: string;
      image: string;
      friendsList: string[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // const response = await fetch("http://localhost:5000/api/trips");
        // if (!response.ok) {
        //     throw new Error("Failed to fetch trips");
        // }
        // const data = await response.json();
        // setTrips(data.trips);
        setTrips(mockTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  if (!user) {
    redirect("/auth/login");
    return null;
  }

  const user_firstName = user.user_metadata.full_name.split(" ")[0];

  if (loading)
    return (
      <p className={`${darkMode ? "text-white" : "text-black"}`}>
        Loading trips...
      </p>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="font-bold text-2xl mb-4 text-[#FF6347]">
        Good Morning, {user_firstName} 👋
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 ${
            darkMode ? "bg-[#1a1e1f]" : "bg-[#FF7F50]"
          } text-[#f8f8f8] rounded-lg shadow-md flex items-center`}
        >
          <FaMap className="text-yellow-400 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Countries Visited</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
        <div
          className={`p-6 ${
            darkMode ? "bg-[#1a1e1f]" : "bg-[#FF8C00]"
          } text-[#f8f8f8] rounded-lg shadow-md flex items-center`}
        >
          <FaTrophy className="text-amber-300 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Top Travel Companion</p>
            <p className="text-xl">
              You've traveled the most with:{" "}
              <span className="font-bold">Alex</span>
            </p>
          </div>
        </div>
        <div
          className={`p-6 ${
            darkMode ? "bg-[#1a1e1f]" : "bg-[#FF4500]"
          } text-[#f8f8f8] rounded-lg shadow-md flex items-center`}
        >
          <FaChartPie className="text-purple-500 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">AI Travel Score</p>
            <p className="text-2xl font-bold">85%</p>
          </div>
        </div>
      </div>

      {/* Recent Trips & AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* AI Recommendations */}
        <div
          className={`${
            darkMode
              ? "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200"
              : "bg-[#FF6347]"
          } text-[#f8f8f8] p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-semibold mb-4">
            AI Travel Recommendations
          </h2>
          <ul className={`space-y-3  ${!darkMode && "text-[#070e0e]"}`}>
            <li
              className={`p-4 ${
                darkMode ? "bg-gray-700" : "bg-[#FFDDC1]"
              } rounded-md`}
            >
              🚀 Japan - Perfect for culture & tech lovers
            </li>
            <li
              className={`p-4 ${
                darkMode ? "bg-gray-700" : "bg-[#FFDDC1]"
              } rounded-md`}
            >
              🌴 Maldives - Best for relaxation & beaches
            </li>
            <li
              className={`p-4 ${
                darkMode ? "bg-gray-700" : "bg-[#FFDDC1]"
              } rounded-md`}
            >
              🎢 Orlando, USA - Adventure & theme parks
            </li>
          </ul>
        </div>
      </div>

      {/* Recent trips */}
      <div
        className={`${
          darkMode
            ? "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200"
            : "bg-[#FF6347]"
        } text-[#f8f8f8] p-6 rounded-lg shadow-md mt-6`}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
        <div
          className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 rounded-3xl ${
            darkMode ? "" : "text-black"
          }`}
        >
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              title={trip.title}
              destination={trip.destination}
              startDate={trip.startDate}
              endDate={trip.endDate}
              image={trip.image}
              friendsList={trip.friendsList}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
