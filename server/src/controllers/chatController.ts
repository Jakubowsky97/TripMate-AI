import { ChatDeepSeek } from "@langchain/deepseek";
import { Request, Response } from "express";
import supabase from "../utils/supabase";
import Amadeus from "amadeus";

const chatModel = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
});

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_SECRET_KEY,
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

const sendMessageToAI = async (
  userId: string,
  message: string,
  tripId: string
) => {
  try {
    // Pobranie historii rozmowy
    const chatHistory = await fetchChatHistory(userId, tripId);

    const systemPrompt = `You are a travel planner AI that helps users create and save personalized trips through conversation. 

Your responsibilities:
1. Extract the user's travel preferences, such as interests, style, transport, accommodation, attractions, and budget.
2. Extract trip data to match the database structure provided, such as title, countries, cities, dates, image, and type of trip.

⚠️ Do not ask the user directly for countries, cities, or places to stay. Infer those from the context of the conversation. Also JSON part of the conversation is only for the AI, not for the user. Do not mention it to the user. ⚠️

Return two JSON objects:
1. "preferences" – User’s long-term travel preferences.
2. "trip" – Data for a single planned trip, suitable for the 'travel_data' table.

In the 'places_to_stay' array, include various places such as accommodations, attractions, or key trip points. Each place should have the following structure:

{
  "name": "Eiffel Tower",
  "city": "Paris",
  "type": "attraction" | "accommodation" | "transport" | "other",
  "start_date": "YYYY-MM-DDTHH:MM" | null,
  "end_date": "YYYY-MM-DDTHH:MM" | null,
  "is_start_point": true | false,
  "is_end_point": true | false,
  "url": "http://example.com" | null
}

For accommodations, include both start_date and end_date.

For attractions, include only start_date with time (e.g., "2025-06-12T14:00") and leave end_date as null.

is_start_point and is_end_point should be true only for the start and final locations of the trip.

Output format:

BEGIN_PREFERENCES_JSON  
{  
  "travel_interests": [...],  
  "travel_style": [...],  
  "preferred_transport": [...],  
  "preferred_accommodation": [...],  
  "favorite_types_of_attractions": [...],  
  "trip_types": [...]  
}  
END_PREFERENCES_JSON  

BEGIN_TRIP_JSON  
{  
  "countries": [...],  
  "cities": [...],  
  "places_to_stay": [
{ "name": "...", "city": "...", "type": "...", "start_date": "...", "end_date": "...", "is_start_point": true | false, "is_end_point": true | false }, ... ],
  "title": "...",  
  "start_date": "YYYY-MM-DD",  
  "end_date": "YYYY-MM-DD",  
  "image": "https://...",  
  "type_of_trip": "..."  
}  
END_TRIP_JSON

Only include values you can extract confidently from the conversation context. Leave out or leave empty any fields you cannot infer. Never invent fictional countries or cities unless explicitly mentioned by the user.
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

    const extractJSONsAndCleanText = (text: string) => {
      const preferencesMatch = text.match(
        /BEGIN_PREFERENCES_JSON\s*([\s\S]*?)\s*END_PREFERENCES_JSON/
      );
      const tripMatch = text.match(
        /BEGIN_TRIP_JSON\s*([\s\S]*?)\s*END_TRIP_JSON/
      );

      let preferences = null;
      let trip = null;

      if (preferencesMatch) {
        try {
          preferences = JSON.parse(preferencesMatch[1]);
        } catch (e) {
          console.error("Błąd parsowania preferences JSON:", e);
        }
      }

      if (tripMatch) {
        try {
          trip = JSON.parse(tripMatch[1]);
        } catch (e) {
          console.error("Błąd parsowania trip JSON:", e);
        }
      }

      // Usuń bloki z tekstu
      const cleanedText = text
        .replace(
          /BEGIN_PREFERENCES_JSON\s*([\s\S]*?)\s*END_PREFERENCES_JSON/,
          ""
        )
        .replace(/BEGIN_TRIP_JSON\s*([\s\S]*?)\s*END_TRIP_JSON/, "")
        .trim();

      return { preferences, trip, cleanedText };
    };

    const { preferences, trip, cleanedText } = extractJSONsAndCleanText(
      String(response.content)
    );

    const intent = await detectIntentBasedOnConversation(cleanedText);

    if (intent === "accommodation") {
      console.log("Użytkownik chce zarezerwować nocleg");
      // Wywołaj API dla noclegów
      const accommodationData = await fetchAccommodationData(message);
      console.log(accommodationData);
    } else if (intent === "flight") {
      console.log("Użytkownik chce znaleźć lot");
      // Wywołaj API dla lotów
      const flightData = await fetchFlightData(message);
      console.log(flightData);
    }

    if (preferences) {
      console.log("Wyekstrahowane preferencje:", preferences);
    } else {
      console.log("Nie udało się wyekstrahować danych preferencji.");
    }

    if (trip) {
      console.log("Wyekstrahowane dane podróży:", trip);
    } else {
      console.log("Nie udało się wyekstrahować danych podróży.");
    }

    // Zapisanie wiadomości użytkownika i odpowiedzi AI do bazy
    const { error: insertError } = await supabase.from("chat_messages").insert([
      { user_id: userId, trip_id: tripId, role: "user", content: message },
      {
        user_id: userId,
        trip_id: tripId,
        role: "assistant",
        content: cleanedText,
      },
    ]);

    if (insertError) throw insertError;

    return { message: cleanedText };
  } catch (error) {
    console.error("Błąd wysyłania wiadomości do AI:", error);
    throw new Error("Nie udało się przetworzyć wiadomości.");
  }
};

const detectIntentBasedOnConversation = async (conversationText: string) => {
  // Implementacja rozpoznawania intencji na podstawie analizy całej rozmowy
  const response = await chatModel.invoke([
    {
      role: "system",
      content:
        "Analyze the conversation for intents related to trip planning, such as booking flights, hotels, etc.",
    },
    { role: "user", content: conversationText },
  ]);

  if (
    typeof response?.content === "string" &&
    response.content.toLowerCase().includes("hotel")
  ) {
    return "accommodation";
  } else if (
    typeof response?.content === "string" &&
    response.content.toLowerCase().includes("flight")
  ) {
    return "flight";
  }

  return null;
};

// Można również stworzyć odpowiednie funkcje fetch dla danych o noclegach i lotach
const fetchAccommodationData = async (message: string) => {
  // Funkcja do pobierania danych o noclegach
  // Implementacja oparta na odpowiednim API
};

const fetchFlightData = async (message: string) => {
  // Funkcja do pobierania danych o lotach
  // Implementacja oparta na odpowiednim API

};

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, message, tripId } = req.body;
    if (!userId || !message || !tripId) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    // Wykonanie logiki wysyłania wiadomości do AI
    const { message: aiMessage } = await sendMessageToAI(
      userId,
      message,
      tripId
    );

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Server error. Please try again later.";
    res.status(500).json({ message: errorMessage });
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
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
