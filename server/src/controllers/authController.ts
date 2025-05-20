// File: server/src/controllers/authController.ts
import { Request, Response } from "express";
import supabase, { supabaseAdmin } from "../utils/supabase";
import { EmailOtpType } from "@supabase/supabase-js";
import { AuthenticatedRequest } from "../middleware/auth";

// Potwierdzenie adresu e-mail
export const confirmEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token_hash, type, next: nextQuery } = req.query;

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

    res.status(200).json({ message: "Email confirmed successfully", success: true, next: nextQuery || "/" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return ;
  }
};


// Sprawdzenie statusu weryfikacji e-mail
export const checkEmailVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.query.user_id as string;

    if (!user_id) {
      res.status(400).json({ error: "Unable to get user" });
      return;
    }

    const { data, error } = await supabaseAdmin
      .auth.admin.getUserById(user_id);

    if (error) {
      console.error("Supabase Error: ", error);
      res.status(500).json({ error: error.message || "Failed to get user" });
    }

    if (data.user?.email_confirmed_at) {
      res.status(200).json({ isConfirmed: true });
    } else {
      res.status(200).json({ isConfirmed: false });
    }

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
