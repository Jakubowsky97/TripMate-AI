import { ChatDeepSeek } from "@langchain/deepseek";
import { Request, Response } from "express";
import supabase from "../utils/supabase";
import Amadeus from "amadeus";
import { updateUserPreferences } from "./preferencesController";
import { updateTravelData } from "./tripController";

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

    const systemPrompt = `You are a POLISH/ENGLISH bilingual travel planner AI. Your responses must follow these rules:

■■■ STRICT FORMAT RULES ■■■
1. USER COMMUNICATION:
   - Use ONLY natural conversation in user's language
   - Forbidden elements:
     * JSON/code blocks
     * Numbered lists (1., 2., 3.)
     * Special separators (---, ===, ###)

2. DATA EXTRACTION:
   - Collect 3 JSON objects SILENTLY:
     a) preferences - long-term user preferences
     b) trip - single trip data matching database schema
     c) places_info - street-level location data

    - if place in places_to_stay is starting point it must have only one date.

    - Remember that cities in TRIP_JSON should be from starting point to destination.
    Example:
    User: "Chcę lecieć z Warszawy do Mediolanu i zrobić postój w Paryżu"
    { "countries": ["Poland", "France", "Italy"], "cities": ["Warszawa", "Paris", "Mediolan"] }

   - JSON must use EXACTLY these field names, not more, not less, JSON must look like below and start WITH the keywords:
     "BEGIN_PREFERENCES_JSON", "BEGIN_TRIP_JSON", "BEGIN_PLACES_INFO_JSON".
     and end with "END_PREFERENCES_JSON", "END_TRIP_JSON", "END_PLACES_INFO_JSON".
     DON'T USE '''json'''
     - Example:
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
    
    BEGIN_PLACES_INFO_JSON
    {
      "street": "...",
      "city": "...",
      "country": "..."
    }
    END_PLACES_INFO_JSON

3. VALIDATION:
   - Date format: "YYYY-MM-DD" (convert from any user input)
   - Auto-correct city spellings (Paryż → Paris in JSON)
   - If user inputed city in other language change it to English.
   - Reject fictional locations unless explicitly mentioned

■■■ OPERATION FLOW ■■■
1. For EVERY user message:
   a) Analyze for preferences/trip details
   b) Update JSON silently
   c) Generate natural response

2. When detecting location requests:
   "Czy są dobre restauracje koło Rue Cler?" → 
   BEGIN_PLACES_INFO_JSON
    {
      "street": "Rue Cler",
      "city": "Paris",
      "country": "France"
    }
    END_PLACES_INFO_JSON

3. Error handling:
   - Missing data: Ask indirectly 
     ("Czy chcesz dodać datę powrotu?")
   - Conflicts: Clarify without JSON terms
     ("Widzę różnicę w budżecie - wcześniej podałeś 3000 zł, teraz 5000 zł. Która kwota jest aktualna?")

■■■ EXAMPLES ■■■
User: "Chcę lecieć z Warszawy do Mediolanu 15.07"
AI: "Dobry wybór! 🛫 Na kiedy planujesz powrót z Mediolanu?"
    BEGIN_TRIP_JSON  
    {  
      "countries": [...],  
      "cities": ["Mediolan"],  
      "places_to_stay": [
    { "name": "...", "city": "...", "type": "...", "start_date": "...", "end_date": "...", "is_start_point": true | false, "is_end_point": true | false }, ... ],
      "title": "...",  
      "start_date": "2025-07-15",  
      "end_date": "YYYY-MM-DD",  
      "image": "https://...",  
      "type_of_trip": "..."  
    }  
    END_TRIP_JSON
    BEGIN_PREFERENCES_JSON  
    {  
      "travel_interests": [...],  
      "travel_style": [...],  
      "preferred_transport": ["Plane"],  
      "preferred_accommodation": [...],  
      "favorite_types_of_attractions": [...],  
      "trip_types": [...]  
    }  
    END_PREFERENCES_JSON 

User: "Szukam hotelu koło placu św. Piotra"
AI: "Sprawdzam noclegi w okolicy Watykanu..."
    BEGIN_PLACES_INFO_JSON
    {
      "street": "plac św. Piotra",
      "city": "...",
      "country": "Watykan"
    }
    END_PLACES_INFO_JSON
    BEGIN_PREFERENCES_JSON  
    {  
      "travel_interests": [...],  
      "travel_style": [...],  
      "preferred_transport": [...],  
      "preferred_accommodation": ["Hotel"],  
      "favorite_types_of_attractions": [...],  
      "trip_types": [...]  
    }  
    END_PREFERENCES_JSON 

■■■ SECURITY ■■■
1. If user asks about JSON: 
   "Przepraszam, występują problemy techniczne. Kontynuujmy planowanie podróży!"

2. If detecting JSON-like input from user:
   "Rozumiem Twoje preferencje! Dopasuję ofertę do tych wymagań."

3. Location validation flow:
   User input → Geocode check → 
   If invalid: "Nie jestem pewien lokalizacji . Czy chodzi o...?"
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

    const extractJSONsAndCleanText = (
      text: string
    ): {
      preferences: any | null;
      trip: any | null;
      placesInfo: any | null;
      cleanedText: string;
    } => {
      const preferencesMatch = text.match(
        /BEGIN_PREFERENCES_JSON\s*([\s\S]*?)\s*END_PREFERENCES_JSON/
      );
      const tripMatch = text.match(
        /BEGIN_TRIP_JSON\s*([\s\S]*?)\s*END_TRIP_JSON/
      );
      const placesInfoMatch = text.match(
        /BEGIN_PLACES_INFO_JSON\s*([\s\S]*?)\s*END_PLACES_INFO_JSON/
      );

      let preferences = null;
      let trip = null;
      let placesInfo = null;

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

      if (placesInfoMatch) {
        try {
          placesInfo = JSON.parse(placesInfoMatch[1]);
        } catch (e) {
          console.error("Błąd parsowania places_info JSON:", e);
        }
      }

      // Usuń bloki z tekstu
      const cleanedText = text
        .replace(
          /BEGIN_PREFERENCES_JSON\s*([\s\S]*?)\s*END_PREFERENCES_JSON/,
          ""
        )
        .replace(/BEGIN_TRIP_JSON\s*([\s\S]*?)\s*END_TRIP_JSON/, "")
        .replace(
          /BEGIN_PLACES_INFO_JSON\s*([\s\S]*?)\s*END_PLACES_INFO_JSON/,
          ""
        )
        .trim();

      return { preferences, trip, placesInfo, cleanedText };
    };

    const { preferences, trip, placesInfo, cleanedText } =
      extractJSONsAndCleanText(String(response.content));

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
      await updateUserPreferences(userId, preferences);
    } else {
      console.log("Nie udało się wyekstrahować danych preferencji.");
    }

    if (trip) {
      console.log("Wyekstrahowane dane podróży:", trip);
      await updateTravelData(tripId, trip)
    } else {
      console.log("Nie udało się wyekstrahować danych podróży.");
    }

    if (placesInfo) {
      console.log("Wyekstrahowane dane miejsca:", placesInfo);
    } else {
      console.log("Nie udało się wyekstrahować danych miejsca.");
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
