"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { fetchChatHistory, sendMessageToServer } from "@/app/api/chatApi";
import { FaPaperPlane } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { Virtuoso } from "react-virtuoso";
import { useNextStep } from "@/context/NextStepContext";

interface ChatMessage {
  text: string;
  sender: "user" | "assistant";
  type?: "message" | "places";
  places?: {
    name: string;
    description?: string;
    location: { lat: number; lng: number };
    place_id: string;
  }[];
}

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [tripId, setTripId] = useState("");
  const [userId, setUserId] = useState("");
  const searchParams = useSearchParams();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [places, setPlaces] = useState<any>(null);
  const { setNext } = useNextStep();

  useEffect(() => {
    const welcomeMessage = "**Hello! I'm your travel assistant.**";
    setChatHistory([
      { text: welcomeMessage, sender: "assistant", type: "message" },
    ]);
  }, []);

  useEffect(() => {
    const newTripId = searchParams.get("trip_id") || "";
    const newUserId = localStorage.getItem("user_id") || "";

    if (newTripId !== tripId) setTripId(newTripId);
    if (newUserId !== userId) setUserId(newUserId);
  }, [searchParams, tripId, userId]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!userId || !tripId) return;
      try {
        const history = await fetchChatHistory(userId, tripId);
        setChatHistory([...chatHistory, ...history]);
      } catch (error) {
        console.error("Błąd pobierania historii:", error);
      }
    };

    loadChatHistory();
  }, [userId, tripId]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    setPlaces(null);

    setChatHistory((prev) => [
      ...prev,
      { text: `${text}`, sender: "user", type: "message" },
    ]);
    setUserMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await sendMessageToServer(text, tripId, userId);
        setChatHistory((prev) => [
          ...prev,
          { text: "", sender: "assistant", type: "message" },
        ]);

        setPlaces(response.places);
        setTrip(response.trip);
        animateText(response.message);

        if (response.places) {
          setChatHistory((prev) => [
            ...prev,
            {
              text: "",
              sender: "assistant",
              type: "places",
              places: response.places,
            } as any,
          ]);
        }
      } catch {
        setChatHistory((prev) => [
          ...prev,
          {
            text: "**Could not fetch data from the server. Please try again.**",
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
    a: ({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#1E90FF",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        {...props}
      >
        {children}
      </a>
    ),
  };

  useEffect(() => {
    if (trip) {
      if (
        trip &&
        Array.isArray(trip.places_to_stay) &&
        trip.places_to_stay.some(
          (place: any) => place.is_start_point && place.is_end_point
        )
      ) {
        setNext(true);
      }
    }
  }, [trip, setTrip]);

  return (
    <div className="flex flex-col items-center justify-between h-full overflow-y-hidden">
      <div className="w-full max-w-4xl flex flex-col h-[84vh] overflow-y-auto p-2 scrollbar-hide">
        <Virtuoso
          style={{ height: "86vh" }}
          className="scrollbar-hide mb-4"
          data={chatHistory}
          followOutput
          itemContent={(index, msg) => (
            <>
              {msg.type === "places" && msg.places ? (
                <>
                <div>
                  <div
                    className={`p-3 my-5 rounded-xl max-w-full shadow-md ${
                      msg.sender === "user"
                        ? "bg-orange-500 text-white self-end rounded-tr-none"
                        : "bg-white text-gray-700 self-start rounded-tl-none"
                    }`}
                  >
                    <ReactMarkdown components={renderers}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>  
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {msg.places.slice(0, 5).map((place: any) => (
                    <div
                      key={place.place_id}
                      className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <img src={place.icon} alt="" className="w-6 h-6" />
                        <span className="font-semibold text-lg">{place.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">{place.vicinity}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 font-bold">
                          {place.rating ?? "Brak oceny"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({place.user_ratings_total ?? 0} opinii)
                        </span>
                      </div>
                      {place.opening_hours && (
                        <div className="text-xs">
                          {place.opening_hours.open_now ? (
                            <span className="text-green-600">Otwarte</span>
                          ) : (
                            <span className="text-red-500">Zamknięte</span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {place.types?.slice(0, 3).map((type: string) => (
                          <span
                            key={type}
                            className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                </>
              ) : (
                <div
                  className={`p-3 my-5 rounded-xl max-w-full shadow-md ${
                    msg.sender === "user"
                      ? "bg-orange-500 text-white self-end rounded-tr-none"
                      : "bg-white text-gray-700 self-start rounded-tl-none"
                  }`}
                >
                  <ReactMarkdown components={renderers}>{msg.text}</ReactMarkdown>
                </div>
              )}
            </>
          )}
        />

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-gray-500 italic mb-6"
          >
            AI is typing...
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
            placeholder="Ask me anything about your trip..."
            className="flex-1 p-3 pl-4 bg-[#f3f4f6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <button
            onClick={() => handleUserMessage(userMessage)}
            disabled={isTyping || !userMessage.trim()}
            className={`p-3 bg-[#f97316] text-white rounded-full shadow-md hover:bg-[#f58434] transition ${
              isTyping || !userMessage.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
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
