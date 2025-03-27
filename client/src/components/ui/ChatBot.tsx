"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sendMessageToServer } from "@/app/api/chatApi";
import { Sun, Plane, Send } from "lucide-react";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const welcomeMessage =
      "🌴 Hello, traveler! I'm your AI assistant, here to help you plan an unforgettable trip. Let's start by choosing a destination! ✈️";
    setChatHistory([`🤖 AI: ${welcomeMessage}`]);
  }, []);

  const handleUserMessage = async () => {
    if (!userMessage.trim()) return;

    setChatHistory((prev) => [...prev, `🧑‍💻 You: ${userMessage}`]);
    setUserMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await sendMessageToServer(userMessage);
        setChatHistory((prev) => [...prev, `🤖 AI: ${response.message}`]);
      } catch (error) {
        setChatHistory((prev) => [...prev, "🤖 AI: Oops! Something went wrong. Try again."]);
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-200 via-blue-300 to-blue-500 p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="text-center text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-4">
          <Sun className="text-yellow-500" /> AI Travel Planner <Plane className="text-blue-500" />
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2">
          {chatHistory.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-xl max-w-xs shadow-md ${
                msg.startsWith("🧑‍💻") ? "bg-blue-100 self-end" : "bg-yellow-100 self-start"
              }`}
            >
              {msg}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-gray-500 italic"
            >
              AI is typing...
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Where do you want to go?"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUserMessage}
            disabled={isTyping}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition disabled:bg-gray-400 flex items-center gap-2"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
