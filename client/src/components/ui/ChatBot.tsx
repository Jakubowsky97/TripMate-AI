"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { fetchChatHistory, sendMessageToServer } from "@/app/api/chatApi";
import { FaPaperPlane } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [tripId, setTripId] = useState("");
  const [userId, setUserId] = useState("");
  const searchParams = useSearchParams();
  const [chatHistory, setChatHistory] = useState<
    {
      text: string;
      sender: "user" | "assistant";
      type?: "message";
    }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const welcomeMessage =
      "**Cześć!** Jestem Twoim asystentem podróży. W czym mogę Ci pomóc?";
    setChatHistory([
      { text: welcomeMessage, sender: "assistant", type: "message" },
    ]);
  }, []);

  useEffect(() => {
    const newTripId = searchParams.get("trip_id") || "";
    const newUserId = searchParams.get("user_id") || "";

    if (newTripId !== tripId) setTripId(newTripId);
    if (newUserId !== userId) setUserId(newUserId);
  }, [searchParams, tripId, userId]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if(!userId || !tripId) return;
      try {
        const history = await fetchChatHistory(userId, tripId);
        setChatHistory(history);
      } catch (error) {
        console.error("Błąd pobierania historii:", error);
      }
    };

    loadChatHistory();
  }, [userId, tripId]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { text: `${text}`, sender: "user", type: "message" },
    ]);
    setUserMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await sendMessageToServer(text, tripId, userId);
        // Dodajemy pustą wiadomość AI, którą później zaktualizujemy
        setChatHistory((prev) => [
          ...prev,
          { text: "", sender: "assistant", type: "message" },
        ]);
        animateText(response.message);
      } catch {
        setChatHistory((prev) => [
          ...prev,
          {
            text: "**Coś poszło nie tak.** Spróbuj ponownie.",
            sender: "assistant",
            type: "message",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };
  
    // Funkcja do przewijania na dół
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    };
  
    // Wywołanie scrollowania przy każdej zmianie wiadomości
    useEffect(() => {
      scrollToBottom();
    }, [chatHistory]);

  const animateText = (text: string) => {
    let i = 0;
    const words = text.split(" ");
    const interval = setInterval(() => {
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        // Zmieniamy tylko tekst ostatniej wiadomości AI
        updatedHistory[updatedHistory.length - 1].text = words
          .slice(0, i + 1)
          .join(" ");
        return updatedHistory;
      });
      i++;
      if (i >= words.length) {
        clearInterval(interval);
      }
    }, 150); // Co 150 ms pokazujemy jeden wyraz
  };

  const renderers = {
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1E90FF", textDecoration: "underline", cursor: "pointer" }}
        {...props}
      >
        {children}
      </a>
    )
  };

  return (
    <div className="flex flex-col items-center justify-between h-full pt-4 overflow-y-hidden">
      <div className="w-full max-w-4xl flex flex-col h-[84vh] overflow-y-auto space-y-3 p-2 scrollbar-hide pb-12">
        {chatHistory.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-full shadow-md ${
              msg.sender === "user"
                ? "bg-orange-500 text-white self-end rounded-tr-none"
                : "bg-white text-gray-700 self-start rounded-tl-none"
            }`}
          >
            <ReactMarkdown components={renderers}>{msg.text}</ReactMarkdown>
          </motion.div>
        ))}

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

        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-3 shadow-lg">
        <div className="flex items-center gap-4 w-full max-w-3xl mx-auto">
          <button className="text-[#9ca3af]">
            <FaRegImage size={24} />
          </button>
          <input
            type="text"
            value={userMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUserMessage(userMessage);
              }
            }}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Zadaj pytanie o podróż..."
            className="flex-1 p-3 pl-4 bg-[#f3f4f6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <button
            onClick={() => handleUserMessage(userMessage)}
            disabled={isTyping || !userMessage.trim()}
            className="p-3 bg-[#f97316] text-white rounded-full shadow-md hover:bg-[#f58434] transition"
            type="submit"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
