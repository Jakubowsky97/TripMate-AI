// File: server/src/controllers/authController.ts
import { Response } from "express";
import supabase from "../utils/supabase";
import { EmailOtpType } from "@supabase/supabase-js";
import { AuthenticatedRequest } from "../middleware/auth";

// Potwierdzenie adresu e-mail
export const confirmEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token_hash, type, next: nextQuery } = req.query;
    const user_id = req.user?.sub; // Pobieramy user_id z JWT

    if (!user_id) {
      res.status(400).json({ error: "Unable to get user" });
      return;
    }
    if (!token_hash || !type) {
      res.status(400).json({ error: "Missing token_hash or type" });
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ isConfirmed: true })
      .eq("id", user_id);

    if (updateError) {
      console.error("Error updating email confirmation status:", updateError);
      res.status(500).json({ message: "Failed to update confirmation status" });
      return;
    }

    res.status(200).json({ message: "Email confirmed successfully", success: true, next: nextQuery || "/" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return ;
  }
};


// Sprawdzenie statusu weryfikacji e-mail
export const checkEmailVerification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.sub; // Pobieramy user_id z JWT

    if (!user_id) {
      res.status(400).json({ error: "Unable to get user" });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("isConfirmed")
      .eq("id", user_id);

    if (error) {
      console.error("Error fetching email confirmation status:", error);
      res.status(500).json({ message: "Failed to fetch confirmation status" });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ isConfirmed: data[0].isConfirmed });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// Zapisanie preferencji użytkownika
export const saveUserPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.sub; // Pobieramy user_id z JWT
    const { preferences } = req.body;

    if (!user_id || !preferences) {
      res.status(400).json({ error: "Missing user ID or preferences" });
      return;
    }

    const { data, error } = await supabase
      .from("user_travel_preferences")
      .upsert(
        [
          {
            id: user_id,
            travel_interests: preferences.travel_interests || [],
            travel_style: preferences.travel_style || [],
            preferred_transport: preferences.preferred_transport || [],
            preferred_accommodation: preferences.preferred_accommodation || [],
            favorite_types_of_attractions: preferences.favorite_types_of_attractions || [],
          },
        ],
        { onConflict: "id" }
      );

    if (error) {
      console.error("Supabase Error: ", error);
      res.status(500).json({ error: error.message || "Failed to save preferences" });
      return;
    }

    res.status(200).json({ message: "Preferences saved successfully", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
