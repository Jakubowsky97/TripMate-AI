'use client';

import { useState } from 'react';

export default function SidebarRight() {
  const [messages, setMessages] = useState([
    { user: 'Alice', text: 'Hey, where are we going first?' },
    { user: 'Bob', text: 'Let’s start with the hotel check-in.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { user: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.user}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 flex-grow rounded-md"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-4 py-2 ml-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
