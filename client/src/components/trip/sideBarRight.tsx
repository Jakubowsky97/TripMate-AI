"use client";

import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import UserAvatars from "../ui/UserAvatars";
import PlannerChat from "../ui/plannerChat";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

interface Message {
  id?: string;
  trip_id?: string;
  user_id: string;
  text: string;
  created_at?: string;
}

export default function SidebarRight({
  activeUsers,
  localData,
  messages = [], // Default empty array
  onSendMessage,
}: {
  activeUsers: UserData[];
  localData: UserData;
  messages?: Message[];
  onSendMessage: (text: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  // Only process messages if they exist
  const enrichedMessages = (messages || []).map((msg) => {
    // Find user from activeUsers
    const user = msg.user_id === localData.id 
      ? localData 
      : activeUsers.find(u => u.id === msg.user_id);
      
    return {
      ...msg,
      user: user || {
        id: msg.user_id,
        full_name: "Unknown",
        avatar_url: "",
        username: "",
        email: "",
      }
    };
  });

  return (
    <div className="w-1/5 bg-white overflow-y-auto flex flex-col h-screen pt-20">
      <h2 className="text-lg font-semibold mb-4 p-4 pb-0">Group Chat</h2>
      <div className="flex pl-4 pb-4 gap-3 items-center">
        <UserAvatars users={activeUsers} size={8} />
        <p className="text-sm text-gray-400 font-semibold">
          {activeUsers.length} active now
        </p>
      </div>
      <hr />

      <PlannerChat messages={enrichedMessages} currentUserId={localData.id} />

      <hr />
      <div className="mt-4 flex p-4 pt-0">
        <form className="w-full mx-auto px-2" onSubmit={handleSend}>
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type a message..."
              required
            />
            <button
              type="submit"
              className="text-orange-500 absolute inset-y-0 end-5 flex items-center ps-3 hover:text-orange-700"
            >
              <IoIosSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}