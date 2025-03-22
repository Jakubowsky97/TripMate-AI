"use client";

import dynamic from "next/dynamic";
import TripMap from "@/components/trip/tripMap";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SidebarLeft from "@/components/trip/sideBarLeft";
import SidebarRight from "@/components/trip/sideBarRight";
import { createClient } from "@/utils/supabase/client";

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

        const { data: avatarData, error } = await supabase.storage.from('avatars').download(user.avatar_url)
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(avatarData)

        if (user) {
          setLocalData({
            id: userId || "",
            full_name: user.full_name || "",
            username: user.username || "",
            email: user.email || "",
            avatar_url: url || "",
          });
          setAllUsers([...allUsers, user]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [searchParams]);

  const [activeUsers, setActiveUsers] = useState([
    {
      id: "1",
      avatar_url: "/avatars/alice.jpg",
      full_name: "Alice Johnson",
      username: "alicej",
      email: "alice@example.com",
    },
    {
      id: "2",
      avatar_url: "/avatars/bob.jpg",
      full_name: "Bob Smith",
      username: "bob_s",
      email: "bob@example.com",
    },
    {
      id: "3",
      avatar_url: "/avatars/charlie.jpg",
      full_name: "Charlie Brown",
      username: "charlieb",
      email: "charlie@example.com",
    },
    {
      id: "4",
      avatar_url: "/avatars/david.png",
      full_name: "David Wilson",
      username: "davidw",
      email: "david@example.com",
    },
  ]);

  const [inactiveUsers, setInactiveUsers] = useState([
    {
      id: "5",
      avatar_url: "/avatars/charlie.png",
      full_name: "Charlie Brown",
      username: "charlieb",
      email: "charlie@example.com",
    },
    {
      id: "6",
      avatar_url: "/avatars/david.png",
      full_name: "David Wilson",
      username: "davidw",
      email: "david@example.com",
    },
  ]);

  const [allUsers, setAllUsers] = useState<UserData[]>([...activeUsers, ...inactiveUsers]);
  
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
