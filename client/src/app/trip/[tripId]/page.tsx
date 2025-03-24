"use client";

import dynamic from "next/dynamic";
import TripMap from "@/components/trip/tripMap";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SidebarLeft from "@/components/trip/sideBarLeft";
import SidebarRight from "@/components/trip/sideBarRight";
import { createClient } from "@/utils/supabase/client";
import { fetchFriendsData } from "@/utils/fetchTrips";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

const socket = io("http://localhost:5000");

// Lazy load TripHeader to prevent SSR issues
const TripHeader = dynamic(() => import("@/components/trip/tripHeader"), {
  ssr: false,
});

export default function TripPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = Array.isArray(params?.tripId)
    ? params.tripId[0]
    : params?.tripId;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userId = searchParams.get("user_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();
  const [tripData, setTripData] = useState({
    id: 0,
    title: "",
    start_date: "",
    end_date: "",
    image: "",
    type_of_trip: "",
    owner_id: "",
    friends_list: [""],
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [localData, setLocalData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("Missing or invalid user_id");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/getUser?user_id=${userId}`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch user data");

        const user = data.data[0] || null;
        setUserData(user);

        const { data: avatarData, error } = await supabase.storage
          .from("avatars")
          .download(user.avatar_url);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(avatarData);

        if (user) {
          setLocalData({
            id: userId || "",
            full_name: user.full_name || "",
            username: user.username || "",
            email: user.email || "",
            avatar_url: url || "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    const getTripData = async () => {
      if (!userId) {
        setError("Missing or invalid user_id");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getTripById/${tripId}?user_id=${userId}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch trip data");
        }
        setTripData({
          id: data.data.id,
          title: data.data.title,
          start_date: data.data.start_date,
          end_date: data.data.end_date,
          image: data.data.image,
          type_of_trip: data.data.type_of_trip,
          owner_id: data.data.profiles_travel_data[0].user_id,
          friends_list: data.data.friends_list,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    getTripData();
  }, [searchParams]);

  useEffect(() => {
    const getFriendsData = async () => {
      if (!tripData.friends_list || tripData.friends_list[0] === "") {
        return;
      }

      try {
        const response = fetchFriendsData(tripData.friends_list);
        const friendsData = await response;
        console.log(friendsData);
        friendsData.map(async (friend: UserData) => {
          const { data: avatarData, error } = await supabase.storage
            .from("avatars")
            .download(friend.avatar_url);
          if (error) {
            throw error;
          }
          const url = URL.createObjectURL(avatarData);
          setActiveUsers((prev) => [...prev, { ...friend, avatar_url: url }]);
        });
      } catch (err) {
        console.error("Error fetching friends data:", err);
      }
    };
    getFriendsData();
  }, [tripData]);

  const [activeUsers, setActiveUsers] = useState<UserData[]>([]);

  useEffect(() => {
    if (localData.id) {
      setActiveUsers([localData]); // Dodaj użytkownika do aktywnych
    }
  }, [localData]);

  const [inactiveUsers, setInactiveUsers] = useState<UserData[]>([]);

  const [allUsers, setAllUsers] = useState<UserData[]>([
    ...activeUsers,
    ...inactiveUsers,
  ]);

  const [selectedPlaces, setSelectedPlaces] = useState([
    {
      name: "Paris, France",
      type: "Start",
      date: "June 15, 2025 - 09:00 AM",
      weather: { temp: "24°C", condition: "Sunny" },
      coordinates: [48.8566, 2.3522],
    },
    {
      name: "Amsterdam, Netherlands",
      type: "2 days",
      date: "June 18-20, 2025",
      places: ["Grand Hotel", "3 Restaurants"],
      coordinates: [52.3676, 4.9041],
    },
    {
      name: "Amsterdam, Netherlands",
      type: "2 days",
      date: "June 18-20, 2025",
      places: ["Grand Hotel", "3 Restaurants"],
      coordinates: [52.3676, 4.9041],
    },
    {
      name: "Berlin, Germany",
      type: "End",
      date: "June 22, 2025 - 18:00 PM",
      weather: { temp: "22°C", condition: "Partly Cloudy" },
      coordinates: [52.52, 13.405],
    },
  ]);

  if (!tripId) return <p>Ładowanie...</p>;

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col h-screen">
      <TripHeader
        mapRef={mapRef}
        tripId={tripId}
        socket={socket}
        localData={localData}
        allUsers={allUsers}
      />
      <div className="flex flex-grow">
        <SidebarLeft selectedPlaces={selectedPlaces} />
        <div className="flex-grow">
          <TripMap tripId={tripId} mapRef={mapRef} socket={socket} />
        </div>
        <SidebarRight activeUsers={activeUsers} localData={localData} />
      </div>
    </div>
  );
}
