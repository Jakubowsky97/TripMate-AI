"use client"; 
import { useState } from "react";
import { FaUser, FaBell, FaCog, FaTrash } from "react-icons/fa";

const tabs = ["Profile", "Preferences", "Notifications", "Account"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input type="text" className="w-full p-2 rounded border" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input type="text" className="w-full p-2 rounded border" placeholder="Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="w-full p-2 rounded border" placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" className="w-full p-2 rounded border" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <input type="file" className="w-full p-2 rounded border" />
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
    <div className="min-h-screen bg-[#f8f8f8] text-[#070e0e] p-6">
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
