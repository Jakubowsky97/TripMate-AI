import { ChatDeepSeek } from "@langchain/deepseek";
import { Request, Response } from "express";
import supabase from "../utils/supabase";

const chatModel = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
});

const fetchChatHistory = async (userId: string, tripId: string) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", userId)
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Błąd pobierania historii czatu:", error);
    return [];
  }

  return data.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};


const sendMessageToAI = async (userId: string, message: string, tripId: string) => {
  try {
    // Pobranie historii rozmowy
    const chatHistory = await fetchChatHistory(userId, tripId);

    const systemPrompt = `
      You are an AI travel assistant.
      Your job is to help users create and suggest trips based on their preferences.
      If the user has not provided preferences yet, try to gather details.
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: message },
    ];

    // Wysłanie wiadomości do modelu AI
    const response = await chatModel.invoke(messages);

    if (!response?.content) {
      throw new Error("Brak odpowiedzi od AI.");
    }

    // Zapisanie wiadomości użytkownika i odpowiedzi AI do bazy
    const { error: insertError } = await supabase.from("chat_messages").insert([
      { user_id: userId, trip_id: tripId, role: "user", content: message },
      { user_id: userId, trip_id: tripId, role: "assistant", content: response.content },
    ]);

    if (insertError) throw insertError;

    return { message: response.content };
  } catch (error) {
    console.error("Błąd wysyłania wiadomości do AI:", error);
    throw new Error("Nie udało się przetworzyć wiadomości.");
  }
};



export const chatController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, message, tripId } = req.body;
    if (!userId || !message || !tripId) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    // Wykonanie logiki wysyłania wiadomości do AI
    const { message: aiMessage } = await sendMessageToAI(userId, message, tripId);

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error. Please try again later.";
    res.status(500).json({ message: errorMessage });
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, tripId } = req.query; // Pobieranie userId i tripId z query params

    if (!userId || !tripId) {
      res.status(400).json({ message: "Brak wymaganych parametrów." });
      return;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Błąd pobierania historii: ${error.message}`);
    }

    // Przekształcamy format, aby pasował do frontendu
    const formattedHistory = data.map((msg) => ({
      text: msg.content,
      sender: msg.role === "user" ? "user" : "assistant",
      type: "message",
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error("Error while fetching chat history:", error);
    res.status(500).json({ message: "Nie udało się pobrać historii rozmowy." });
  }
};
