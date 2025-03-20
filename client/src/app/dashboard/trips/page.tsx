"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/ui/TripCard";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import CreateTripCard from "@/components/ui/CreateTripCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const TripsPage = () => {
  const { darkMode } = useDarkMode();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const supabase = createClient();
  const [trips, setTrips] = useState<{
    id: number;
    title: string;
    typeOfTrip: string;
    startDate: string;
    endDate: string;
    image: string | null;
    friendsList: string[] | null;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/getAllTrips/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
    
        if (data && data.data) {
          const mappedTrips = await Promise.all(
            data.data.map(async (item: any) => {
              let imageUrl = null;
              const imagePath = item.travel_data.image ? `${userId}/${item.travel_data.image}` : null;
    
              if (imagePath) {
                // Generate a signed URL only if the image exists
                const { data: signedUrlData, error: signedUrlError } = await supabase
                  .storage
                  .from("trip-images/user-images")
                  .createSignedUrl(imagePath, 60); // 60 seconds validity
    
                if (signedUrlError) {
                  console.error("Error getting signed URL:", signedUrlError);
                } else {
                  imageUrl = signedUrlData.signedUrl;
                }
              }
    
              return {
                id: item.travel_data.id,
                title: item.travel_data.title,
                typeOfTrip: item.travel_data.type_of_trip || "No type specified",
                startDate: item.travel_data.start_date,
                endDate: item.travel_data.end_date,
                image: imageUrl || "/default-image.jpg",  // Fallback to a default image if none exists
                friendsList: item.travel_data.friends_list || [],
              };
            })
          );
    
          console.log(mappedTrips);
          setTrips(mappedTrips);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    

    fetchTrips();
  }, [userId]); // Ensure the fetch is triggered when the userId changes

  const handleCreateTrip = () => {
    router.push(`/trip/creator?user_id=${userId}`);
  };

  if (loading) return <p className={`${darkMode ? "text-white" : "text-black"}`}>Loading trips...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 rounded-3xl p-1 md:p-8 ${
        darkMode ? "" : "text-black"
      }`}>
      <CreateTripCard darkMode={darkMode} onCreateTrip={handleCreateTrip} />
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          title={trip.title}
          typeOfTrip={trip.typeOfTrip}
          startDate={trip.startDate}
          endDate={trip.endDate}
          image={trip.image || ""}
          friendsList={trip.friendsList || []}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default TripsPage;
