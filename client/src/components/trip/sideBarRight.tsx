"use client";

import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import UserAvatars from "../ui/UserAvatars";
import SmallScreenChat from "../ui/smallScreenChat";
import PlannerChat from "../ui/plannerChat";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

export default function SidebarRight({ activeUsers, localData } : { activeUsers: any[]; localData: UserData }) {
  const [messages, setMessages] = useState([
    { user: activeUsers[0], text: "Hey, where are we going first?" },
    { user: activeUsers[1], text: "Let's start with the hotel check-in." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { user: localData, text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-1/5 bg-white overflow-y-auto flex flex-col">
      <h2 className="text-lg font-semibold mb-4 p-4 pb-0">Group Chat</h2>
      <div className="flex pl-4 pb-4 gap-3 items-center">
        <UserAvatars users={activeUsers} size={8} />
        <p className="text-sm text-gray-400 font-semibold">{activeUsers.length} active now</p>
      </div>
      <hr />

      {/*<SmallScreenChat messages={messages} />*/}
      <PlannerChat messages={messages} currentUserId={localData.id} />

      <hr className=""/>
      <div className="mt-4 flex p-4 pt-0">
        <form className="w-full mx-auto px-2">
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              id="default-search"
              className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type a message..."
              required
            />
            <button className="text-orange-500 absolute inset-y-0 end-5 flex items-center ps-3 hover:text-orange-700" onClick={sendMessage}>
                <IoIosSend size={20}/>
            </button>
          </div>
            
        </form>
      </div>
    </div>
  );
}
