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

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, username, avatar_url } = req.body;

        if (!user_id || typeof user_id !== "string") {
            res.status(400).json({ error: "Missing or invalid user_id" });
            return;
        }

        const updateFields: any = {};
        if (username) updateFields.username = username;
        if (avatar_url) updateFields.avatar_url = avatar_url;

        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        const { data, error } = await supabase
            .from("users")
            .update(updateFields)
            .eq("id", user_id);

        if (error) {
            res.status(500).json({ error: "Error updating user profile", details: error.message });
            return;
        }

        res.status(200).json({ message: "User profile updated successfully", data });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};

export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, ...updatedFields } = req.body;


      if (!user_id || typeof user_id !== "string") {
        res.status(400).json({ error: "Missing or invalid user_id" });
        return;
      }

      if (Object.keys(updatedFields).length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }
      const { data, error } = await supabase
        .from("user_travel_preferences")
        .update(updatedFields) 
        .eq("user_id", user_id);

      if (error) {
        res.status(500).json({ error: "Error updating preferences", details: error.message });
        return;
      }

      res.status(200).json({ message: "Preferences updated successfully", data });

    } catch (err) {
      res.status(500).json({ error: "Internal server error", details: err });
    }
  };

  export const getPreferences = async (req: Request, res: Response): Promise<void>=> {
    try{
    const { user_id } = req.query;
  
    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id parameter" });
      return;
    }
    let errors: string[] = [];
  
    const {data:travel_preferences,error:travel_preferences_err}  = await supabase.from("user_travel_preferences").select("travel_preferences").eq("id","");
    if (travel_preferences_err) errors.push("Error fetching travel preferences: " + travel_preferences_err.message);
    //
    const {data:travel_style,error:travel_style_err}  = await supabase.from("user_travel_preferences").select("travel_style").eq("id","");
    if (travel_style_err) errors.push("Error fetching travel style: " + travel_style_err.message);
    //
    const {data:prefered_transport,error:prefered_transport_err}  = await supabase.from("user_travel_preferences").select("prefered_transport").eq("id","");
    if (prefered_transport_err) errors.push("Error fetching preferred transport: " + prefered_transport_err.message);
    //
    const {data:prefered_accomodation,error:prefered_accomodation_err}  = await supabase.from("user_travel_preferences").select("prefered_accomodation").eq("id","");
    if (prefered_accomodation_err) errors.push("Error fetching preferred accommodation: " + prefered_accomodation_err.message);
    //
    const {data:favorite_types_of_attractions,error:favorite_types_of_attractions_err}  = await supabase.from("user_travel_preferences").select("favorite_types_of_attractions").eq("id","");
    if (favorite_types_of_attractions_err) errors.push("Error fetching favorite attractions: " + favorite_types_of_attractions_err.message);
  
    //  const { data, error } = await supabase
    //.from("user_travel_preferences")
    // .select("travel_preferences, travel_style, prefered_transport, prefered_accomodation, favorite_types_of_attractions")
    // .eq("user_id", user_id)
    // masz zapytania osobno albo w jednym zalezy jak ci wygodnie 
  
    if (errors.length > 0) {
      res.status(207).json({
        message: "Partial success",
        errors,
        data: {
          travel_preferences,
          travel_style,
          prefered_transport,
          prefered_accomodation,
          favorite_types_of_attractions,
        },
      });
      return;
    }
  
    res.status(200).json({
      travel_preferences,
      travel_style,
      prefered_transport,
      prefered_accomodation,
      favorite_types_of_attractions,
    });
  }
  catch(err){
    res.status(500).json({ error: "Internal server error", details: err });
  }
  };
  export const updateEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, new_email } = req.body;

        if (!user_id || !new_email) {
            res.status(400).json({ error: "Missing user_id or new_email" });
            return;
        }

        const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
            email: new_email
        });

        if (error) {
            res.status(500).json({ error: "Error updating email", details: error.message });
            return;
        }

        res.status(200).json({ message: "Email updated successfully", data });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};