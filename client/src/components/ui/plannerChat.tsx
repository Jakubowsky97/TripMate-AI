import { useEffect, useRef } from "react";
import Image from "next/image";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

const PlannerChat = ({
  messages,
  currentUserId,
}: {
  messages: { user: UserData; text: string }[];
  currentUserId: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Funkcja do przewijania na dół
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Wywołanie scrollowania przy każdej zmianie wiadomości
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 max-h-[70vh]">
      {messages.map((msg, index) => {
        if (!msg.user) return null;
        const isCurrentUser = msg.user.id === currentUserId;

        return (
          <div
            key={index}
            className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            {!isCurrentUser && (
              <Image
                src={msg.user.avatar_url || "/img/default.jpg"}
                alt={msg.user.full_name}
                width={40}
                height={40}
                className="w-9 h-9 object-cover rounded-full"
              />
            )}
            <div
              className={`ml-3 p-4 rounded-lg max-w-[80%] break-words ${
                isCurrentUser ? "bg-[#f97316] text-white mr-3" : "bg-[#fff7ed] text-black"
              }`}
            >
              <span>{msg.text}</span>
            </div>
          </div>
        );
      })}
      {/* Element referencji do przewijania */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default PlannerChat;