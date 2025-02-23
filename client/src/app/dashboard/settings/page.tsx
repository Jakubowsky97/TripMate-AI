"use client";
import Avatar from "@/components/ui/Avatar";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaBell, FaCog, FaTrash } from "react-icons/fa";
import { resetPassword, sendResetPassword } from "../actions";

const tabs = ["Profile", "Preferences", "Notifications", "Account"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const { darkMode } = useDarkMode();
  interface UserData {
    avatar_url: string;
    full_name: string;
    username: string;
    email: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = searchParams.get("user_id");
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
        setUserData(data.data[0] || null);
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

    fetchUserData();
  }, [searchParams]);

  const [localFirstName, setFirstName] = useState("");
  const [localLastName, setLastName] = useState("");
  const [localUsername, setUsername] = useState("");
  const [localEmail, setEmail] = useState("");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.full_name.split(" ")[0] || "");
      setLastName(userData.full_name.split(" ")[1] || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setAvatarUrl(userData.avatar_url || "");
    }
  }, [userData]);
  

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>, url: string) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileName = `${url}`;
      const filePath = `${fileName}`;

      const response = await fetch("http://localhost:5000/api/profile/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: searchParams.get("user_id"),
          avatar_url: filePath,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }
      setAvatarUrl(filePath);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: searchParams.get("user_id"),
          full_name: `${localFirstName} ${localLastName}`,
          username: localUsername,
          email: localEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update user data");
      }
      setUserData(data.data?.[0] || null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  }

  const handleChangePassword = () => {
    sendResetPassword(localEmail);
  }
  
  const renderContent = () => {
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={localFirstName}
                onChange={handleFirstNameChange}
                className={`w-full p-2 mt-2 rounded border ${
                  darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"
                }`}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={localLastName}
                onChange={handleLastNameChange}
                className={`w-full p-2 mt-2 rounded border ${
                  darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"
                }`}
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={localUsername}
                onChange={handleUsernameChange}
                className={`w-full p-2 mt-2 rounded border ${
                  darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"
                }`}
                placeholder="john.doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={localEmail}
                onChange={handleEmailChange}
                className={`w-full p-2 mt-2 rounded border ${
                  darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"
                }`}
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                disabled
                autoComplete="new-password"
                className={`w-full p-2 mt-2 rounded border ${
                  darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200 border-[#2D2D2D]"
                }`}
                placeholder="••••••••"
              />
            </div>
            <div>
              <span className="text-[#777C90]">
                You want to change password?{" "}
                  <span onClick={handleChangePassword} className="text-[#142F32] hover:text-[#0F2528]">
                    Reset password
                  </span>
                </span>
              </div>
            <div>
            <label className="block text-sm font-medium">Avatar</label>
              <Avatar
                url={avatarUrl}
                size={150}
                onUpload={(event, url) => {
                  handleAvatarUpload(event, url)
                }}
              />
            </div>
            <div>
              <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>Save Changes</button>
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
