"use client";
import { useState } from "react";
import ProfilePage from "@/components/settings/profilePage";
import PreferencesPage from "@/components/settings/preferencesPage";
import { redirect } from "next/navigation";

const tabs = ["Profile", "Preferences", "Notifications", "Account"];

export default function Settings({ user } : { user: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
    if (!user) {
        redirect("/auth/login");
        return null;
      }

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfilePage /> ;
      case "Preferences":
        return <PreferencesPage />;
      case "Notifications": 
        return <p>Work in progress</p>;
      case "Account":
        return <button className="bg-red-500 text-white p-2 rounded">Delete Account</button>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen md:p-6">
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
