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
import TripShareModal from "@/components/ui/TripShareModal";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

export interface Message {
  id: string; // UUID
  trip_id: string;
  user_id: string;
  text: string;
  created_at: string; // ISO string
  user?: UserData; // Dodawane opcjonalnie z relacji
}

const socket = io(process.env.NEXT_PUBLIC_API_URL);

// Lazy load TripHeader to prevent SSR issues
const TripHeader = dynamic(() => import("@/components/trip/tripHeader"), {
  ssr: false,
});

export default function TripPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const mapRef = useRef<google.maps.Map>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = Array.isArray(params?.tripId)
    ? params.tripId[0]
    : params?.tripId;
  const [userId, setUser_id] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();
  const [tripData, setTripData] = useState({
    id: 0,
    countries: [""],
    cities: [""],
    places_to_stay: [""],
    places_to_visit: [""],
    title: "",
    start_date: "",
    end_date: "",
    image: "",
    type_of_trip: "",
    owner_id: "",
    friends_list: [""],
    trip_code: "",
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [localData, setLocalData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    avatar_url: "",
  });
  const [showShareModal, setShowShareModal] = useState(false);

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
          places_to_visit: data.data.places_to_visit,
          title: data.data.title,
          start_date: data.data.start_date,
          end_date: data.data.end_date,
          image: data.data.image,
          type_of_trip: data.data.type_of_trip,
          owner_id: data.data.profiles_travel_data[0].user_id,
          friends_list: data.data.friends_list,
          trip_code: data.data.trip_code,
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

        let placesToVisit =
          typeof data.data.places_to_visit === "string"
            ? JSON.parse(data.data.places_to_visit)
            : data.data.places_to_visit;

        // Sortuj rosnąco po dacie
        placesToVisit = placesToVisit.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

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
            typeOfPlace: "stay",
            country,
          });
        }

        for (const place of placesToVisit) {
          const countryIndex = cities.indexOf(place.city);
          const country = countries[countryIndex] || "";

          await addPlaceWithWeather({
            city: place.city,
            name: place.name,
            date: place.date,
            time: place.time || "",
            notes: place.notes || "",
            type: place.type,
            typeOfPlace: "visit",
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

    if (userId) {
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
    type?: string;
    typeOfPlace: string;
    date?: string;
    time?: string;
    notes?: string;
    end_date?: string;
    start_date?: string;
    is_end_point?: boolean;
    is_start_point?: boolean;
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
      const coordinates = [location.lng, location.lat];

      // 3. Przetwarzanie daty
      const start_date = new Date(place.start_date ?? "");
      const end_date = new Date(place.end_date ?? "");
      const date_to_visit = new Date(place.date ?? "");

      let date = "";

      if (place.typeOfPlace === "visit") {
        date =
          date_to_visit.toLocaleString("en-GB", { month: "long" }) +
          ` ${date_to_visit.getDate()}, ${date_to_visit.getFullYear()}`;
      } else {
        if (place.is_start_point) {
          date =
            start_date.toLocaleString("en-GB", { month: "long" }) +
            ` ${start_date.getDate()}, ${start_date.getFullYear()}`;
        } else if (place.is_end_point) {
          date =
            end_date.toLocaleString("en-GB", { month: "long" }) +
            ` ${end_date.getDate()}, ${end_date.getFullYear()}`;
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
      }
      const fullPlace = {
        ...place,
        type: place.type ?? "",
        start_date: place.start_date ?? "",
        end_date: place.end_date ?? "",
        is_start_point: place.is_start_point ?? false,
        is_end_point: place.is_end_point ?? false,
        country: place.country,
        typeOfPlace: place.typeOfPlace,
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
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (localData.id) {
      setActiveUsers([localData]); // Dodaj użytkownika do aktywnych
    }
    setAllUsers([...activeUsers, ...inactiveUsers]);
  }, [localData]);

  useEffect(() => {
    if (!tripId || !localData.id) return;

    // Presence channel
    const presence = supabase
      .channel(`presence-trip-${tripId}`)
      .on("presence", { event: "sync" }, () => {
        const state = presence.presenceState();
        // Transform the presence state into UserData objects
        const presentUsers: UserData[] = [localData]; // Always include local user

        // Each key in the state object contains an array of presence objects
        Object.values(state).forEach((userInstances: any[]) => {
          userInstances.forEach((instance) => {
            // Only add if the instance contains the required UserData properties and it's not the local user
            if (
              instance.id &&
              instance.id !== localData.id && // Prevent duplicates of local user
              instance.avatar_url &&
              instance.full_name &&
              instance.username &&
              instance.email
            ) {
              // Check if this user is already in our presentUsers array
              const existingIndex = presentUsers.findIndex(
                (u) => u.id === instance.id
              );
              if (existingIndex === -1) {
                presentUsers.push({
                  id: instance.id,
                  avatar_url: instance.avatar_url,
                  full_name: instance.full_name,
                  username: instance.username,
                  email: instance.email,
                });
              }
            }
          });
        });

        setActiveUsers(presentUsers);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presence.track({
            id: localData.id,
            avatar_url: localData.avatar_url,
            full_name: localData.full_name,
            username: localData.username,
            email: localData.email,
            joined_at: new Date().toISOString(),
          });
        }
      });

    // Cleanup presence on unmount
    return () => {
      presence.unsubscribe();
    };
  }, [tripId, localData]);

  const fetchUserAvatars = async (userId: string) => {
    try {
      // Find if user already exists in activeUsers
      const existingUser = activeUsers.find((u) => u.id === userId);
      if (existingUser) return existingUser;

      // If not, fetch user data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching user data:", error);
        return null;
      }

      // Download avatar
      const { data: avatarData, error: avatarError } = await supabase.storage
        .from("avatars")
        .download(data.avatar_url);

      if (avatarError) {
        console.error("Error downloading avatar:", avatarError);
        return {
          id: data.id,
          full_name: data.full_name,
          username: data.username,
          email: data.email,
          avatar_url: "",
        };
      }

      const url = URL.createObjectURL(avatarData);

      return {
        id: data.id,
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        avatar_url: url,
      };
    } catch (err) {
      console.error("Error in fetchUserAvatars:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!tripId) return;

    // Chat channel
    const chat = supabase
      .channel(`chat-trip-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `trip_id=eq.${tripId}`,
        },
        async ({ new: msg }) => {
          // If the message is from another user, fetch their data
          if (msg.user_id !== localData.id) {
            const userData = await fetchUserAvatars(msg.user_id);
            if (userData) {
              // Add to activeUsers if not already there
              setActiveUsers((prev) => {
                if (!prev.some((u) => u.id === userData.id)) {
                  return [...prev, userData];
                }
                return prev;
              });
            }
          }
          setMessages((prev) => [...prev, msg as Message]);
        }
      )
      .subscribe();

    // Initial load of messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        // Create a set of unique user IDs from messages
        const userIds = new Set(data.map((msg) => msg.user_id));

        // Fetch user data for each unique user ID
        const userPromises = Array.from(userIds).map(async (userId) => {
          if (userId === localData.id) return localData;
          return await fetchUserAvatars(userId);
        });

        const users = await Promise.all(userPromises);
        const validUsers = users.filter((u) => u !== null) as UserData[];

        // Update active users with message senders
        setActiveUsers((prev) => {
          const newUsers = [...prev];
          validUsers.forEach((user) => {
            if (!newUsers.some((u) => u.id === user.id)) {
              newUsers.push(user);
            }
          });
          return newUsers;
        });

        setMessages(data);
      }
    };

    loadMessages();

    return () => {
      chat.unsubscribe();
    };
  }, [tripId, localData.id]);

  const sendMessage = async (text: string) => {
    if (!localData) return;
    await supabase
      .from("messages")
      .insert([{ trip_id: tripId, user_id: localData.id, text }]);
  };

  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  console.log("Active users:", activeUsers);

  const [selectedPlaces, setSelectedPlaces] = useState<
    {
      city: string;
      country: string;
      places: {
        city: string;
        name: string;
        type: string;
        start_date?: string;
        end_date?: string;
        is_start_point?: boolean;
        is_end_point?: boolean;
        country: string;
        weather: { temp: string; condition: string };
        coordinates: any[];
        date?: string;
        notes?: string;
        time?: string;
        typeOfPlace?: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    let changed = false;

    const hasStart = selectedPlaces.some((city) =>
      city.places.some((place) => place.is_start_point)
    );

    const hasEnd = selectedPlaces.some((city) =>
      city.places.some((place) => place.is_end_point)
    );

    if (!hasStart || !hasEnd) {
      setSelectedPlaces((prev) => {
        const updated = prev.map((city) => ({
          ...city,
          places: city.places.map((place) => ({ ...place })),
        }));

        if (!hasStart) {
          const firstCity = updated[0];
          if (firstCity && firstCity.places.length > 0) {
            firstCity.places[0].is_start_point = true;
            changed = true;
          }
        }

        if (!hasEnd) {
          const lastCity = updated[updated.length - 1];
          if (lastCity && lastCity.places.length > 0) {
            lastCity.places[lastCity.places.length - 1].is_end_point = true;
            changed = true;
          }
        }

        return changed ? updated : prev;
      });
    }
  }, [selectedPlaces]);

  useEffect(() => {
    // Sprawdź czy selectedPlaces zawiera rzeczywiste dane
    if (
      selectedPlaces.length === 0 ||
      selectedPlaces.every((city) => city.places.length === 0)
    ) {
      return; // Nie wykonuj zapisu, jeśli brak danych
    }

    const places_to_stay = selectedPlaces.flatMap((city) =>
      city.places.filter((place) => place.typeOfPlace === "stay")
    );

    const places_to_visit = selectedPlaces.flatMap((city) =>
      city.places.filter((place) => place.typeOfPlace === "visit")
    );

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/updateTrip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: tripId,
        places_to_stay: places_to_stay,
        places_to_visit: places_to_visit,
      }),
      credentials: "include",
    });
  }, [selectedPlaces, tripId]); // Zmiana z setSelectedPlaces na selectedPlaces

  if (!sessionChecked) return <p>Sprawdzanie sesji...</p>;
  if (!tripId) return <p>Ładowanie...</p>;
  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tripData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col">
      <TripHeader
        mapRef={mapRef}
        tripId={tripId}
        socket={socket}
        localData={localData}
        allUsers={allUsers}
        onShareClick={() => setShowShareModal(true)}
      />
      {tripData?.trip_code && showShareModal && (
        <TripShareModal
          shareCode={tripData.trip_code}
          onClose={() => setShowShareModal(false)}
        />
      )}

      <div className="flex flex-1">
        <SidebarLeft
          selectedPlaces={selectedPlaces}
          mapRef={mapRef}
          setSelectedPlaces={setSelectedPlaces}
          tripId={tripId}
        />
        <div className="flex-grow h-full pt-18 relative">
          <TripMap
            tripId={tripId}
            mapRef={mapRef}
            socket={socket}
            selectedPlaces={selectedPlaces}
            onRemovePlace={(placeToRemove) => {
              setSelectedPlaces((prev) =>
                prev.map((city) => ({
                  ...city,
                  places: city.places.filter(
                    (place) =>
                      !(
                        place.name === placeToRemove.name &&
                        place.coordinates[0] === placeToRemove.coordinates[0] &&
                        place.coordinates[1] === placeToRemove.coordinates[1]
                      )
                  ),
                }))
              );
            }}
          />
        </div>

        <SidebarRight
          activeUsers={activeUsers}
          localData={localData}
          onSendMessage={sendMessage}
          messages={messages}
        />
      </div>
    </div>
  );
}
