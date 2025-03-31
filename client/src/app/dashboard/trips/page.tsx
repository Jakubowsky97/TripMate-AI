"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/ui/TripCard";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { fetchTrips, fetchTripsFromFriends } from "@/utils/fetchTrips";
import { FaFilter, FaPlus } from "react-icons/fa";

interface Owner {
  id: string; // Unikalny identyfikator właściciela
  full_name: string; // Pełne imię i nazwisko właściciela
  username: string; // Nazwa użytkownika
  email: string; // Adres e-mail właściciela
  avatar_url: string; // Ścieżka do zdjęcia profilowego
  isConfirmed: boolean; // Status potwierdzenia właściciela
  updated_at: string; // Data ostatniej aktualizacji
}

const TripsPage = () => {
  const { darkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const supabase = createClient();
  const [trips, setTrips] = useState<
    {
      id: number;
      title: string;
      typeOfTrip: string;
      startDate: string;
      endDate: string;
      image: string | null;
      friendsList: { id: string; full_name: string }[];
      owner: Owner;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!user_id) {
          throw new Error("User ID is required to fetch trips");
        }
        const userTrips = await fetchTrips(user_id);
        const friendsTrips = await fetchTripsFromFriends(user_id);
        setTrips([...(userTrips || []), ...(friendsTrips || [])]);
      } catch (err) {
        setError("Failed to fetch trips");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [user_id]);

  const handleCreateTrip = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/createTrip`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      })

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      const data = await response.json();
      router.push(`/trip/creator?user_id=${user_id}&trip_id=${data.travelData.id}`);
    } catch (err) { 
      console.log("Failed to create trip", err);
    }
  };

  const handleFilterClick = () => {
    router.push(`/trip/filter?user_id=${user_id}`);
  };

  if (loading)
    return (
      <p className={`${darkMode ? "text-white" : "text-black"}`}>
        Loading trips...
      </p>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-1 md:p-8 md:pt-4">
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`font-semibold text-3xl ${darkMode ? "text-white" : "text-black"
            }`}
        >
          My Trips
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={handleFilterClick}
            className={`flex items-center justify-center space-x-2 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${darkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"  // Ciemny tryb
                : "bg-[#FFB703] hover:bg-[#FF7F50] text-white"  // Jasny tryb, pomarańczowy
              } text-sm sm:text-base py-1 px-2`} 
          >
            <FaFilter />
            <span>Filter</span>
          </button>
        
        <button
          onClick={handleCreateTrip}
          className={`flex items-center justify-center space-x-2 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${darkMode
              ? "bg-blue-600 hover:bg-blue-800 text-white"  // Ciemny tryb
              : "bg-[#FF7F50] hover:bg-[#FF5733] text-white"  // Jasny tryb, pomarańczowy
            } text-sm sm:text-base py-1 px-2`} 
        >
          <FaPlus />
          <span>Create trip</span>
        </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 rounded-3xl ${darkMode ? "" : "text-black"
          }`}
      >
        {/* {<CreateTripCard darkMode={darkMode} onCreateTrip={handleCreateTrip} />} */}
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            title={trip.title}
            typeOfTrip={trip.typeOfTrip}
            startDate={trip.startDate}
            endDate={trip.endDate}
            image={trip.image || ""}
            owner={trip.owner}
            friendsList={trip.friendsList || []}
            darkMode={darkMode}
            onClick={() => router.push(`/trip/${trip.id}?user_id=${user_id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default TripsPage;
