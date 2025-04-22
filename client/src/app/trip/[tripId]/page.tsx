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
  const [sessionChecked, setSessionChecked] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = Array.isArray(params?.tripId)
    ? params.tripId[0]
    : params?.tripId;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userId, setUser_id] = useState<string | null>(null);
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

  useEffect(() => {
    setUser_id(localStorage.getItem("user_id"));
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error.message);
        setError("Error checking session");
      } else if (data.session) {
        setSessionChecked(true);
      } else {
        setSessionChecked(false);
      }
    };
    checkSession();
  }, []); 

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/getUser`,
          {
            credentials: "include",
          }
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getTripById/${tripId}`,
          {
            credentials: "include",
          }
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

        const initialPlaces = cities.map((city: string, index: number) => ({
          city,
          country: countries[index] || countries[0] || "",
          places: [],
        }));

        setSelectedPlaces(initialPlaces);

        for (const place of places) {
          const countryIndex = cities.indexOf(place.city);
          const country = countries[countryIndex] || "";

          await addPlaceWithWeather({
            city: place.city,
            name: place.name,
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

    if(userId) {
      fetchUserData();
      getTripData();
    }

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
    name: string;
    type: string;
    end_date: string;
    start_date: string;
    is_end_point: boolean;
    is_start_point: boolean;
    country: string;
  }) => {
    try {
      // 1. Pogoda z OpenWeather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${place.city}&appid=17364394130fee8e7efd3f7ae2d533c5&units=metric`
      );
      const weather = weatherResponse.data;

      // 2. Współrzędne z Google Maps
      const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      const coordinatesResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: `${place.name}, ${place.city}, ${place.country}`,
            key: googleApiKey,
          },
        }
      );

      if (
        coordinatesResponse.data.status !== "OK" ||
        coordinatesResponse.data.results.length === 0
      ) {
        throw new Error("Nie udało się pobrać współrzędnych z Google Maps");
      }

      const location = coordinatesResponse.data.results[0].geometry.location;
      const coordinates = [location.lng, location.lat]; // dopasowane do mapRef

      // 3. Przetwarzanie daty
      const start_date = new Date(place.start_date);
      const end_date = new Date(place.end_date);

      let date = "";
      if (place.is_start_point) {
        date =
          start_date.toLocaleString("en-GB", { month: "long" }) +
          ` ${start_date.getDate()}, ${start_date.getFullYear()}`;
        place.type = "Start";
      } else if (place.is_end_point) {
        date =
          end_date.toLocaleString("en-GB", { month: "long" }) +
          ` ${end_date.getDate()}, ${end_date.getFullYear()}`;
        place.type = "End";
      } else if (place.start_date && place.end_date) {
        if (
          start_date.toLocaleDateString("en-GB", { month: "long" }) ===
          end_date.toLocaleDateString("en-GB", { month: "long" })
        ) {
          if (start_date.getDate() === end_date.getDate()) {
            date =
              start_date.toLocaleString("en-GB", { month: "long" }) +
              ` ${start_date.getDate()}, ${start_date.getFullYear()}`;
          } else {
            date =
              start_date.toLocaleString("en-GB", { month: "long" }) +
              ` ${start_date.getDate()}-${end_date.getDate()}, ${start_date.getFullYear()}`;
          }
        } else {
          date =
            start_date.toLocaleString("en-GB", { month: "long" }) +
            ` ${start_date.getDate()} - ${end_date.toLocaleString("en-GB", {
              month: "long",
            })} ${end_date.getDate()}, ${start_date.getFullYear()}`;
        }
      }

      // 4. Finalny obiekt miejsca
      const fullPlace = {
        ...place,
        weather: {
          temp: `${weather.main.temp.toFixed(1)}°C`,
          condition:
            weather.weather[0].description.charAt(0).toUpperCase() +
            weather.weather[0].description.slice(1),
        },
        coordinates,
        date,
      };

      // 5. Aktualizacja wybranych miejsc
      setSelectedPlaces((prev) => {
        const updated = [...prev];
        const cityIndex = updated.findIndex((p) => p.city === place.city);

        if (cityIndex !== -1) {
          const existingPlaceIndex = updated[cityIndex].places.findIndex(
            (p) => p.name === place.name
          );
          if (existingPlaceIndex === -1) {
            updated[cityIndex].places.push(fullPlace);
          }
        } else {
          updated.push({
            city: place.city,
            country: place.country,
            places: [fullPlace],
          });
        }

        updated.sort((a, b) => a.city.localeCompare(b.city));

        return updated;
      });
    } catch (error) {
      console.error(
        `Nie udało się pobrać pogody lub współrzędnych dla ${place.city}:`,
        error
      );
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

  const [selectedPlaces, setSelectedPlaces] = useState<
    {
      city: string;
      country: string;
      places: {
        city: string;
        name: string;
        type: string;
        start_date: string;
        end_date: string;
        is_start_point: boolean;
        is_end_point: boolean;
        country: string;
        weather: { temp: string; condition: string };
        coordinates: any[];
        date: string;
      }[];
    }[]
  >([]);

  if (!sessionChecked) return <p>Sprawdzanie sesji...</p>;
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
        <SidebarLeft selectedPlaces={selectedPlaces} mapRef={mapRef} />
        <div className="flex-grow h-full pt-18">
          <TripMap
            tripId={tripId}
            mapRef={mapRef}
            socket={socket}
            selectedPlaces={selectedPlaces}
          />
        </div>
        <SidebarRight activeUsers={activeUsers} localData={localData} />
      </div>
    </div>
  );
}
