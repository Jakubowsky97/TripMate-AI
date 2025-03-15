"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/ui/TripCard";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import CreateTripCard from "@/components/ui/CreateTripCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const mockTrips = [
    {
        id: 1,
        title: "Trip to Paris",
        destination: "Paris, France",
        startDate: "2025-03-01",
        endDate: "2025-03-10",
        image: "https://jjgtakmeqaeguwsarenk.supabase.co/storage/v1/object/sign/trip-images/paris.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0cmlwLWltYWdlcy9wYXJpcy5qcGciLCJpYXQiOjE3NDE4ODUxMjQsImV4cCI6MTc0NDQ3NzEyNH0.OBQV4W_A-y2fBFqUMGOPXzLJoxd2Ou89E0PWEcRCv7g",
        friendsList: ["Alice", "Bob"],
    },
    {
        id: 2,
        title: "Trip to New York",
        destination: "New York, USA",
        startDate: "2025-04-15",
        endDate: "2025-04-20",
        image: "https://jjgtakmeqaeguwsarenk.supabase.co/storage/v1/object/sign/trip-images/newYork.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0cmlwLWltYWdlcy9uZXdZb3JrLndlYnAiLCJpYXQiOjE3NDE4ODUwMzgsImV4cCI6MTc0NDQ3NzAzOH0.uDia57sZUaN7pUUJ0nb2nRw3aAbmGHKZJeUdNJW8EmM",
        friendsList: ["Charlie", "Dave"],
    },
];

const TripsPage = () => {
    const { darkMode } = useDarkMode();
    const searchParams = useSearchParams();
    const userId = searchParams.get("user_id");
    const [trips, setTrips] = useState<
        { id: number; title: string; destination: string; startDate: string; endDate: string; image: string; friendsList: string[] }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

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
                        destination={trip.destination}
                        startDate={trip.startDate}
                        endDate={trip.endDate}
                        image={trip.image}
                        friendsList={trip.friendsList}
                        darkMode={darkMode}
                    />
                ))}
        </div>
    );
};

export default TripsPage;