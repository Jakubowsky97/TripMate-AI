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
import axios from "axios";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

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
    countries: [""],
    cities: [""],
    places_to_stay: [""],
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

  // Socket connection cleanup
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("Missing or invalid user_id");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/getUser?user_id=${userId}`
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
          countries: data.data.countries,
          cities: data.data.cities,
          places_to_stay: data.data.places_to_stay,
          title: data.data.title,
          start_date: data.data.start_date,
          end_date: data.data.end_date,
          image: data.data.image,
          type_of_trip: data.data.type_of_trip,
          owner_id: data.data.profiles_travel_data[0].user_id,
          friends_list: data.data.friends_list,
        });
        const countries =
          typeof data.data.countries === "string"
            ? JSON.parse(data.data.countries)
            : data.data.countries;

        const cities =
          typeof data.data.cities === "string"
            ? JSON.parse(data.data.cities)
            : data.data.cities;

        const places =
          typeof data.data.places_to_stay === "string"
            ? JSON.parse(data.data.places_to_stay)
            : data.data.places_to_stay;

        for (const place of places) {
          const countryIndex = cities.indexOf(place.city);
          const country = countries[countryIndex] || "";

          await addPlaceWithWeather({
            city: place.city,
            is_start_point: place.is_start_point,
            is_end_point: place.is_end_point,
            start_date: place.start_date,
            end_date: place.end_date,
            type: place.type,
            country,
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

    fetchUserData();
    getTripData();
  }, [searchParams, tripId, userId]);

  useEffect(() => {
    const getFriendsData = async () => {
      if (
        !tripData.friends_list ||
        tripData.friends_list[0] === "" ||
        tripData.friends_list.includes(localData.id)
      ) {
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

  const addPlaceWithWeather = async (place: {
    city: string;
    type: string;
    end_date: string;
    start_date: string;
    is_end_point: boolean;
    is_start_point: boolean;
    country: string;
  }) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${place.city}&appid=17364394130fee8e7efd3f7ae2d533c5&units=metric`
      );
      const weather = weatherResponse.data;

      const newPlace = {
        name: place.city,
        type: place.type,
        date: "",
        weather: {
          temp: `${weather.main.temp}°C`,
          condition: weather.weather[0].description.charAt(0).toUpperCase() +
            weather.weather[0].description.slice(1),
        },
        coordinates: [], // Dodaj, jeśli masz
      };

      if (place.is_start_point) { 
        newPlace.type = "Start";
      } else if (place.is_end_point) {
        newPlace.date = place.end_date;
        newPlace.type = "End";
      } else if (place.start_date && place.end_date) {
        newPlace.date = `${place.start_date} - ${place.end_date}`;
      }

      newPlace.name = `${place.city}, ${place.country}`;

      setSelectedPlaces((prev) => [...prev, newPlace]);
    } catch (error) {
      console.error(`Nie udało się pobrać pogody dla ${place.city}:`, error);
    }
  };

  const [activeUsers, setActiveUsers] = useState<UserData[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<UserData[]>([]);

  useEffect(() => {
    if (localData.id) {
      setActiveUsers([localData]); // Dodaj użytkownika do aktywnych
    }
    setAllUsers([...activeUsers, ...inactiveUsers]);
  }, [localData]);

  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  console.log(allUsers);

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
    <div className="flex flex-col">
      <TripHeader
        mapRef={mapRef}
        tripId={tripId}
        socket={socket}
        localData={localData}
        allUsers={allUsers}
      />
      <div className="flex flex-1">
        <SidebarLeft selectedPlaces={selectedPlaces} />
        <div className="flex-grow h-full">
          <TripMap tripId={tripId} mapRef={mapRef} socket={socket} />
        </div>
        <SidebarRight activeUsers={activeUsers} localData={localData} />
      </div>
    </div>
  );
}
