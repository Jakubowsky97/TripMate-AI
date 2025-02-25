import { useEffect, useState } from "react";
import PreferenceCard from "../auth/PreferenceCard";
import { useSearchParams } from "next/navigation";

interface Preferences {
    [key: string]: string[];
  }


  // TODO: wyswitlac preferencje dodane przez uzytkownika
export default function PreferencesPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [preferences, setPreferences] = useState<Preferences>({
        travel_interests: [],
        travel_style: [],
        preferred_transport: [],
        preferred_accommodation: [],
        favorite_types_of_attractions: [],
      });  
    
    useEffect(() => {
        const fetchPreferences = async () => {
            const userId = searchParams.get("user_id");
            if (!userId) {
                setError("Missing or invalid user_id");
                setLoading(false);
                return;
            }
            try {
              const response = await fetch(`http://localhost:5000/api/profile/getPreferences?user_id=${userId}`);
          
              if (!response.ok) {
                throw new Error("Failed to fetch preferences");
              }
          
              const data = await response.json();
              setPreferences({
                travel_interests: data.data[0].travel_interests || [],
                travel_style: data.data[0].travel_style || [],
                preferred_transport: data.data[0].preferred_transport || [],
                preferred_accommodation: data.data[0].preferred_accommodation || [],
                favorite_types_of_attractions: data.data[0].favorite_types_of_attractions || [],
            });
            } catch (error) {
              console.error("Error fetching preferences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [searchParams]);

    const travelPreferences = [
        { category: "Travel Interests", options: ["Adventure", "Cultural Exploration", "Food & Culinary", "Wildlife & Nature", "Relaxation", "History & Heritage"] },
        { category: "Travel Style", options: ["Luxury", "Budget", "Backpacking", "Solo Travel", "Family Travel", "Group Travel"] },
        { category: "Preferred Transport", options: ["Airplane", "Train", "Car Rental", "Bus", "Bicycle", "Walking"] },
        { category: "Preferred Accommodation", options: ["Hotels", "Hostels", "Airbnb", "Resorts", "Camping", "Guesthouses"] },
        { category: "Favorite Types of Attractions", options: ["Beaches", "Mountains", "Historical Sites", "Theme Parks", "Museums", "Nightlife"] },
      ];
      
      const handlePreferenceChange = (category: string, option: string) => {
        const categoryKey = category.replaceAll(" ", "_").toLowerCase();

        setPreferences((prevPreferences) => {
          const updatedPreferences = { ...prevPreferences };
      
          if (updatedPreferences[categoryKey].includes(option)) {
            updatedPreferences[categoryKey] = updatedPreferences[categoryKey].filter(
              (item: string) => item !== option
            );
          } else {
            updatedPreferences[categoryKey].push(option);
          }

          return updatedPreferences;
        });
      };
      
    
    
      const [customText, setCustomText] = useState<{
        [key: string]: string;
      }>({});
      
      const handleCustomTextChange = (category: string, value: string) => {
        const formattedCategory = category.replaceAll(" ", "_").toLowerCase();
    
        // Przechowuj pełny tekst bez modyfikacji.
        setCustomText((prev) => ({
            ...prev,
            [formattedCategory]: value,  // Przechowywanie pełnego tekstu w stanie
        }));
    };

    const handleSubmit = () => {
        const processedCustomText = Object.fromEntries(
            Object.entries(customText).map(([category, text]) => {
                const wordsArray = text.trim().split(" ").filter(Boolean); // Przekształć w tablicę słów
                return [category, wordsArray]; // Zwróć zaktualizowaną tablicę
            })
        );
        
        const updatedPreferences = Object.entries(processedCustomText).reduce(
            (acc, [category, newValues]) => {
              // Jeśli kategoria istnieje w preferences, połącz tablicę (dodaj nowe elementy)
              if (acc[category]) {
                acc[category] = [...new Set([...acc[category], ...newValues])]; // Zapewnia unikalność
              } else {
                acc[category] = newValues; // Jeśli kategoria nie istnieje, dodaj ją
              }
              return acc;
            },
            { ...preferences } // Użyj preferences jako początkowego obiektu
          );
        
        try {
            setLoading(true);
            const userId = searchParams.get("user_id");
            if (!userId) {
                setError("Missing or invalid user_id");
                setLoading(false);
                return;
            }
            fetch(`http://localhost:5000/api/profile/updatePreferences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    ...updatedPreferences,
                }),
            });
        } catch (error) {
            console.error("Error updating preferences:", error);
            setMessage("Failed to update preferences");
        } finally { 
            setLoading(false);
            setMessage("Preferences updated successfully");
        }
    };


      if (loading) return <p>Loading user data...</p>;
      if (error) return <p>Error: {error}</p>;
      return (
                <div>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {travelPreferences.map((category) => (
                        <div key={category.category}>
                        <h3 className="text-xl font-semibold text-[#142F32] mb-2 mt-4">{category.category
                        .replaceAll("_", " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}</h3>
                            <div className="grid grid-cols-2 gap-4">
                            {category.options.map((option) => (
                                <PreferenceCard
                                key={option}
                                category={category.category}
                                option={option}
                                onChange={() => handlePreferenceChange(category.category, option)}
                                isChecked={preferences[category.category.replaceAll(" ", "_").toLowerCase()]?.includes(option)}
                                />
                            ))}
                            </div>
                            <div className="mt-2">
                            <input
                                type="text"
                                value={customText[category.category.replaceAll(" ", "_").toLowerCase()] || ""}
                                onChange={(e) => handleCustomTextChange(category.category, e.target.value)}
                                className="w-full p-2 mt-2 rounded border"
                                placeholder={`Enter your custom options after space for ${category.category}`}
                            />
                            </div>
                        </div>
                        ))}
                    </div>
                    <button className="bg-[#1a1e1f] text-white p-2 rounded mt-4" onClick={handleSubmit}>Save Preferences</button>
                    {message && <p className="mt-4 text-left">{message}</p>}
                </div>
              );
}