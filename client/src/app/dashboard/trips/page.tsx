"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/ui/TripCard";
import { useRouter } from "next/navigation";
import { fetchTrips, fetchTripsFromFriends } from "@/utils/fetchTrips";
import { FaPlus, FaUserPlus } from "react-icons/fa";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

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
  const [user_id, setUser_id] = useState<string | null>(null);
  const [trips, setTrips] = useState<
    {
      id: number;
      title: string;
      typeOfTrip: string;
      startDate: string;
      endDate: string;
      image: string | null;
      friendsList: string[];
      status?: string;
      owner: Owner;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    setUser_id(localStorage.getItem("user_id"));
  }, []);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!user_id) {
          throw new Error("User ID is required to fetch trips");
        }
        const userTrips = await fetchTrips(user_id);
        const friendsTrips = await fetchTripsFromFriends();
        setTrips([...(userTrips || []), ...(friendsTrips || [])]);
      } catch (err) {
        setError("Failed to fetch trips");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      loadTrips();
    }
  }, [user_id]);

  const handleCreateTrip = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/createTrip`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }
      const data = await response.json();
      router.push(`/trip/creator?trip_id=${data.travelData.id}`);
    } catch (err) {
      console.log("Failed to create trip", err);
    }
  };

  const handleJoinTrip = async () => {
    if (joinCode.length !== 6) {
      setJoinError("Please enter a valid 6-character code.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/joinTrip`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ trip_code: joinCode }),
        }
      );

      if (!response.ok) throw new Error("Failed to join trip");

      const data = await response.json();
      setIsJoinModalOpen(false);
      router.push(`/trip/${data.trip_id}`);
    } catch (err) {
      setJoinError("Incorrect code or a problem occurred. Please try again.");
      console.error(err);
    }
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
          className={`font-semibold text-3xl ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          My Trips
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className={`flex items-center justify-center space-x-2 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-150 ease-in-out ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-[#FFA500] hover:bg-[#FF7F50] text-white"
            } text-sm sm:text-base py-1 px-2`}
          >
            <FaUserPlus />
            <span>Join the trip</span>
          </button>

          <button
            onClick={handleCreateTrip}
            className={`flex items-center justify-center space-x-2 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-800 text-white"
                : "bg-[#FF7F50] hover:bg-[#FF5733] text-white"
            } text-sm sm:text-base py-1 px-2`}
          >
            <FaPlus />
            <span>Create trip</span>
          </button>
        </div>
      </div>

      {trips.length === 0 && (
        <div>
          <p
            className={`text-center text-lg ${
              darkMode ? "text-white" : "text-black"
            } w-full`}
          >
            No trips found. Create or join a trip to get started!
          </p>
        </div>
      )}

      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 rounded-3xl ${
          darkMode ? "" : "text-black"
        }
          ${trips.length === 0 ? "hidden" : "block"}
        `}
      >
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
            onClick={() => {
              if (trip.status == "draft") {
                router.push("/trip/creator?&trip_id=" + trip.id);
              } else {
                router.push(`/trip/${trip.id}`);
              }
            }}
          />
        ))}
      </div>
      <Dialog
        open={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 relative">
          {/* Przyciemnione tło */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

          <DialogPanel
            className={`p-6 z-10 rounded-xl shadow-lg w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <DialogTitle
              className={`text-lg font-bold mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Join the trip
            </DialogTitle>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
              maxLength={6}
              className={`w-full px-4 py-2 border rounded-md mb-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              placeholder="Enter the 6-character code"
            />
            {joinError && (
              <p className="text-red-500 text-sm mb-2">{joinError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-black"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTrip}
                className={`px-4 py-2 rounded-md font-bold text-white ${
                  darkMode
                    ? "bg-[#FFA500] hover:bg-[#FF7F50]"
                    : "bg-[#FFA500] hover:bg-[#FF7F50]"
                }`}
              >
                Join
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default TripsPage;
