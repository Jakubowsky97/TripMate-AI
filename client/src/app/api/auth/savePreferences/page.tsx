"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SavePreferences() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("user_id");
            const storedPreferences = localStorage.getItem("preferences");

            setUserId(storedUserId);
            setPreferences(storedPreferences ? JSON.parse(storedPreferences) : null);
        }
    }, []);

    useEffect(() => {
        if (!userId || !preferences) return;

        const savePreferences = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/savePreferences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, preferences }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to save preferences");
                }

                // Preferencje zapisane poprawnie → przekierowanie do dashboardu
                router.push("/dashboard");

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        savePreferences();
    }, [userId, preferences]);

    if (loading) return <p>Saving preferences...</p>;
    if (error) return <p>Error: {error}</p>;

    return null;
}
