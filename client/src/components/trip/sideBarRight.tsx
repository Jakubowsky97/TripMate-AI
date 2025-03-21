"use client";

import { useState } from "react";
import { IoIosSend } from "react-icons/io";

export default function SidebarRight() {
  const [messages, setMessages] = useState([
    { user: "Alice", text: "Hey, where are we going first?" },
    { user: "Bob", text: "Let’s start with the hotel check-in." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-1/5 bg-white overflow-y-auto flex flex-col">
      <h2 className="text-lg font-medium mb-4 p-4 pb-0">Group Chat</h2>
      <hr />
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.user}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
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
            <button className="absolute inset-y-0 end-5 flex items-center ps-3" onClick={sendMessage}>
                <IoIosSend size={20} />
            </button>
          </div>
            
        </form>
      </div>
    </div>
  );
}
