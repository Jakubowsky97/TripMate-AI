import { useEffect, useState } from "react";
import PreferenceCard from "../auth/PreferenceCard";
import { useSearchParams } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";

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
    const { darkMode }= useDarkMode();
    
    useEffect(() => {
        const fetchPreferences = async () => {
            const userId = searchParams.get("user_id");
            if (!userId) {
                setError("Missing or invalid user_id");
                setLoading(false);
                return;
            }
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/getPreferences?user_id=${userId}`);
          
              if (!response.ok) {
                throw new Error("Failed to fetch preferences");
              }
          
              const data = await response.json();
            
            // Ensure data is valid and not undefined
            if (data?.data?.length > 0) {
                setPreferences(data.data[0]);
            } else {
                setPreferences({
                    travel_interests: [],
                    travel_style: [],
                    preferred_transport: [],
                    preferred_accommodation: [],
                    favorite_types_of_attractions: [],
                });
            }
            } catch (error) {
              console.error("Error fetching preferences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [searchParams]);

    
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
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/updatePreferences`, {
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
                    {Object.entries(preferences).map(([categoryKey, options]) => (
                      <div key={categoryKey}>
                        <h3 className={`${darkMode && "text-[#E0E0E0]"} text-[#142F32] text-xl font-semibold mb-2 mt-4`}>
                          {categoryKey.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {options.map((option) => (
                            <PreferenceCard
                              key={option}
                              category={categoryKey}
                              option={option}
                              onChange={() => handlePreferenceChange(categoryKey, option)}
                              isChecked={preferences[categoryKey]?.includes(option)}
                            />
                          ))}
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={customText[categoryKey] || ""}
                            onChange={(e) => handleCustomTextChange(categoryKey, e.target.value)}
                            className={`${darkMode && "bg-[#1E1E1E] placeholder-[#A0A0A0] border-[#2C2C2C]"} w-full p-2 mt-2 rounded border`}
                            placeholder={`Enter your custom options after space for ${categoryKey.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}`}
                          />
                        </div>
                      </div>
                      ))}
                    </div>
                    <button className={`${darkMode ? "bg-[#4e73df] text-white hover:bg-[#2e59e5]" : "bg-[#007bff] text-white hover:bg-[#0056b3]"} text-white p-2 rounded mt-4`} onClick={handleSubmit}>Save Preferences</button>
                    {message && <p className="mt-4 text-left">{message}</p>}
                </div>
              );
}