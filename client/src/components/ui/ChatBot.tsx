"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { sendMessageToServer } from "@/app/api/chatApi";
import { Send, Sun, Mountain, Landmark } from "lucide-react";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { text: string; sender: "user" | "ai"; type?: "message" | "options" | "cards" }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const welcomeMessage = "**Cześć!** Jestem Twoim asystentem podróży. W czym mogę Ci pomóc?";
    setChatHistory([{ text: welcomeMessage, sender: "ai", type: "message" }]);
  }, []);

  const handleUserMessage = async (text: string) => {
    setChatHistory((prev) => [...prev, { text, sender: "user", type: "message" }]);
    setUserMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        if (text === "Wypoczynek") {
          setChatHistory((prev) => [
            ...prev,
            { text: "**Świetny wybór!** Oto kilka popularnych miejsc na wypoczynek:", sender: "ai", type: "message" },
            { text: "", sender: "ai", type: "cards" },
          ]);
        } else {
          const response = await sendMessageToServer(text);
          setChatHistory((prev) => [...prev, { text: response.message, sender: "ai", type: "message" }]);
        }
      } catch {
        setChatHistory((prev) => [...prev, { text: "**Coś poszło nie tak.** Spróbuj ponownie.", sender: "ai", type: "message" }]);
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-4">
      <div className="w-full max-w-2xl flex flex-col h-[85vh] overflow-y-auto space-y-3 p-2">
        {chatHistory.map((msg, index) =>
          msg.type === "message" ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-xl max-w-xl shadow-md ${
                msg.sender === "user" ? "bg-orange-500 text-white self-end rounded-tr-none" : "bg-white text-gray-700 self-start rounded-tl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </motion.div>
          ) : msg.type === "options" ? (
            <div key={index} className="flex gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-xl shadow-md hover:bg-yellow-300"
                onClick={() => handleUserMessage("Wypoczynek")}
              >
                <Sun size={16} /> Wypoczynek
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-200 text-blue-900 rounded-xl shadow-md hover:bg-blue-300"
                onClick={() => handleUserMessage("Aktywny")}
              >
                <Mountain size={16} /> Aktywny
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-orange-200 text-orange-900 rounded-xl shadow-md hover:bg-orange-300"
                onClick={() => handleUserMessage("City break")}
              >
                <Landmark size={16} /> City break
              </button>
            </div>
          ) : (
            <div key={index} className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-100 rounded-xl shadow-md">
                <p className="font-bold">🇬🇷 Greckie wyspy</p>
                <p className="text-sm text-gray-700">Idealna temperatura i krystalicznie czysta woda</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl shadow-md">
                <p className="font-bold">🇭🇷 Chorwacja</p>
                <p className="text-sm text-gray-700">Piękne plaże i historyczne miasta</p>
              </div>
            </div>
          )
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-gray-500 italic"
          >
            AI pisze...
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 w-full max-w-2xl">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleUserMessage(userMessage)}
          disabled={isTyping || !userMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition disabled:bg-gray-400 flex items-center gap-2"
        >
          <Send size={16} /> Wyślij
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
