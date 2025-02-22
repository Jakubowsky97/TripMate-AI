import { Request, Response } from "express";
import supabase from "../utils/supabase";
import { EmailOtpType } from "@supabase/supabase-js";

export const confirmEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token_hash, type, next, user_id } = req.query;

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

                // Aktualizacja statusu potwierdzenia
                const { error: updateError } = await supabase
                .from("profiles")
                .update({ isConfirmed: true })
                .eq("id", user_id);
        
            if (updateError) {
                console.error("Error updating email confirmation status:", updateError);
                res.status(500).json({ message: "Failed to update confirmation status" });
            }
    
        res.status(200).json({ message: "Email confirmed successfully", success: true, next: next || "/" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const checkEmailVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.query;
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
      return;
    }
  };

export const saveUserPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, preferences } = req.body;

        if (!userId || !preferences) {
            res.status(400).json({ error: "Missing user ID or preferences" });
            return;
        }

        const { data, error } = await supabase
        .from('user_travel_preferences')
        .upsert([
          {
            id: userId,
            travel_interests: preferences.travel_interests || [],
            travel_style: preferences.travel_style || [],
            preferred_transport: preferences.preferred_transport || [],
            preferred_accommodation: preferences.preferred_accommodation || [],
            favorite_types_of_attractions: preferences.favorite_types_of_attractions || [],
          }
        ], { onConflict: 'id' });

        if (error) {
            console.error("Supabase Error: ", error);
            res.status(500).json({ error: error.message || "Failed to save preferences" });
            return;
        }

        res.status(200).json({ message: "Preferences saved successfully", data });
    } catch (err) { 
        res.status(500).json({ error: "Internal server error" });
    }
};

