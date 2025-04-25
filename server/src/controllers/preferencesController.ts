//File: server/src/controllers/preferencesController.ts

import supabase from "../utils/supabase";

export const updateUserPreferences = async (userId: string, newPrefs: any) => {
    const { data: existing, error } = await supabase
      .from("user_travel_preferences")
      .select("*")
      .eq("id", userId)
      .single();
  
    if (error && error.code !== "PGRST116") {
      console.error("Błąd przy sprawdzaniu preferencji:", error);
      return;
    }
  
    const mergedPrefs: any = {};
    const keys = [
      "travel_interests",
      "travel_style",
      "preferred_transport",
      "preferred_accommodation",
      "favorite_types_of_attractions",
      "trip_types",
    ];
  
    for (const key of keys) {
      const current = existing?.[key] ?? [];
      const incoming = newPrefs?.[key] ?? [];
  
      mergedPrefs[key] = Array.from(new Set([...current, ...incoming]));
    }
  
    const { error: upsertError } = await supabase
      .from("user_travel_preferences")
      .upsert({id: userId, ...mergedPrefs });
  
    if (upsertError) {
      console.error("Błąd zapisu preferencji:", upsertError);
    }
  };
  