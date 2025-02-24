"use client";
import { useState } from "react";
import PreferenceCard from "@/components/auth/PreferenceCard";
import ProfilePage from "@/components/settings/profilePage";

const tabs = ["Profile", "Preferences", "Notifications", "Account"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const travelPreferences = [
    { category: "Travel Interests", options: ["Adventure", "Cultural Exploration", "Food & Culinary", "Wildlife & Nature", "Relaxation", "History & Heritage"] },
    { category: "Travel Style", options: ["Luxury", "Budget", "Backpacking", "Solo Travel", "Family Travel", "Group Travel"] },
    { category: "Preferred Transport", options: ["Airplane", "Train", "Car Rental", "Bus", "Bicycle", "Walking"] },
    { category: "Preferred Accommodation", options: ["Hotels", "Hostels", "Airbnb", "Resorts", "Camping", "Guesthouses"] },
    { category: "Favorite Types of Attractions", options: ["Beaches", "Mountains", "Historical Sites", "Theme Parks", "Museums", "Nightlife"] },
  ];

  interface Preferences {
    [key: string]: string[];
  }

  const [preferences, setPreferences] = useState<Preferences>({
    travel_interests: [],
    travel_style: [],
    preferred_transport: [],
    preferred_accommodation: [],
    favorite_types_of_attractions: [],
  });  
  
  const handlePreferenceChange = (category: string, option: string) => {
    const categoryKey = category.replace(" ", "_").toLowerCase();
  
    setPreferences((prevPreferences) => {
      const updatedPreferences = { ...prevPreferences };
      console.log("Before update:", updatedPreferences);
  
      // Toggle the option (either add or remove)
      if (updatedPreferences[categoryKey].includes(option)) {
        updatedPreferences[categoryKey] = updatedPreferences[categoryKey].filter(
          (item: string) => item !== option
        );
      } else {
        updatedPreferences[categoryKey].push(option);
      }
  
      console.log("After update:", updatedPreferences);
      return updatedPreferences;
    });
  };
  


  const [customText, setCustomText] = useState<{
    [key: string]: string;
  }>({});
  
  const handleCustomTextChange = (category: string, value: string) => {
    setCustomText((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  

  const renderContent = () => {
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

    switch (activeTab) {
      case "Profile":
        return (
          <ProfilePage setError={setError} setLoading={setLoading}/>
        );
      case "Preferences":
        return (
          <div className="space-y-6">
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
                        isChecked={preferences[category.category.replace(" ", "_").toLowerCase()]?.includes(option)}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customText[category.category] || ""}
                      onChange={(e) => handleCustomTextChange(category.category, e.target.value)}
                      className="w-full p-2 mt-2 rounded border"
                      placeholder={`Enter your custom option for ${category.category}`}
                    />
                  </div>
                </div>
              ))}
            <button className="bg-[#1a1e1f] text-white p-2 rounded">Save Preferences</button>
          </div>
        );
      case "Notifications":
        return <div>Manage your notification settings.</div>;
      case "Account":
        return <button className="bg-red-500 text-white p-2 rounded">Delete Account</button>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex space-x-4 border-b pb-2 mt-4">
        {tabs.map((tab) => (
          <button key={tab} className={`pb-2 ${activeTab === tab ? "border-b-2 border-[#4B5563]" : "text-gray-500"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
