"use client"; 
import { useDarkMode } from "@/components/ui/DarkModeContext";
import { useEffect, useState } from "react";
import { FaUser, FaBell, FaCog, FaTrash } from "react-icons/fa";

const tabs = ["Profile", "Preferences", "Notifications", "Account"];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const { darkMode } = useDarkMode();
    interface UserData {
      fullName: string;
      username: string;
      email: string;
    }

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchUserData = async () => {
        const userId = localStorage.getItem("user_id");
        console.log("User ID:", userId);
        if (!userId) {
            setError("Missing or invalid user_id");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/profile/getUser?user_id=${userId}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch user data");
          }
          setUserData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

  const renderContent = () => {
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

    const firstName = userData?.fullName.split(" ")[0] || "";
    const lastName = userData?.fullName.split(" ")[1] || "";
    const username = userData?.username || "";
    const email = userData?.email || "";

    const [localFirstName, setFirstName] = useState(firstName);
    const [localLastName, setLastName] = useState(lastName);
    const [localUsername, setUsername] = useState(username);
    const [localEmail, setEmail] = useState(email);

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input type="text" value={localFirstName} onChange={handleFirstNameChange} className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input type="text" value={localLastName} onChange={handleLastNameChange} className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} placeholder="Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input type="text" value={localUsername} onChange={handleUsernameChange} className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} placeholder="john.doe" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={localEmail} onChange={handleEmailChange} className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" disabled autoComplete="new-password" className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <input type="file" className={`w-full p-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"}`} />
            </div>
          </div>
        );
      case "Preferences":
        return <div className="space-y-4">Here you can manage your preferences.</div>;
      case "Notifications":
        return <div className="space-y-4">Manage your notification settings.</div>;
      case "Account":
        return (
          <div className="space-y-4">
            <button className="bg-red-500 text-white p-2 rounded">Delete Account</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex space-x-4 border-b pb-2 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-[#4B5563]" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
