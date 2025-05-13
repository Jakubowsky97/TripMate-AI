// File: server/src/controllers/profileController.ts

import { Request, Response } from "express";
import supabase from "../utils/supabase";
import { AuthenticatedRequest } from "../middleware/auth";

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { username, avatar_url, email, full_name } = req.body;
    const user_id = req.user?.sub;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id" });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id);

    const user = userData?.[0];

    const updateFields: any = {};
    if (username && user.username != username) updateFields.username = username;
    if (avatar_url && user.avatar_url != avatar_url)
      updateFields.avatar_url = avatar_url;
    if (email && user.email != email) updateFields.email = email;
    if (full_name && user.full_name != full_name)
      updateFields.full_name = full_name;

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    updateFields.updated_at = new Date();

    const { data, error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", user_id);

    if (updateFields.email) {
      const { data, error } = await supabase.auth.admin.updateUserById(
        user_id,
        {
          email: updateFields.email,
        }
      );

      if (error) {
        res
          .status(500)
          .json({ error: "Error updating email", details: error.message });
        return;
      }
    }

    if (error) {
      res
        .status(500)
        .json({ error: "Error updating user profile", details: error.message });
      return;
    }

    res
      .status(200)
      .json({ message: "User profile updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.sub;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id" });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id);

    if (error) {
      res
        .status(500)
        .json({ error: "Error updating user profile", details: error.message });
      return;
    }

    res
      .status(200)
      .json({ message: "User profile updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getPreferences = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.sub;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id parameter" });
      return;
    }

    const { data, error } = await supabase
      .from("user_travel_preferences")
      .select(
        "travel_interests, travel_style, preferred_transport, preferred_accommodation, favorite_types_of_attractions"
      )
      .eq("id", user_id);

    if (error) {
      res.status(500).json({
        message: "Error fetching user travel preferences",
        details: error,
      });
      return;
    }

    res
      .status(200)
      .json({ message: "User travel preferences fetched successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const updatePreferences = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { ...updatedPreferences } = req.body;
    const user_id = req.user?.sub;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id" });
      return;
    }

    if (Object.keys(updatedPreferences).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    // Check if the record exists for the user_id
    const { data: existingData, error: findError } = await supabase
      .from("user_travel_preferences")
      .select("id")
      .eq("id", user_id)
      .single(); // Ensure only a single row is returned

    if (findError && findError.code !== "PGRST116") {
      // Handle errors other than "no rows" (PGRST116)
      res.status(500).json({
        error: "Error checking for existing record",
        details: findError.message,
      });
      return;
    }

    if (existingData) {
      // Record exists, update it
      const { data, error } = await supabase
        .from("user_travel_preferences")
        .update(updatedPreferences)
        .eq("id", user_id);

      if (error) {
        res.status(500).json({
          error: "Error updating preferences",
          details: error.message,
        });
        return;
      }

      res
        .status(200)
        .json({ message: "Preferences updated successfully", data });
    } else {
      // Record doesn't exist, create it
      const { data, error } = await supabase
        .from("user_travel_preferences")
        .insert([{ id: user_id, ...updatedPreferences }]);

      if (error) {
        res.status(500).json({
          error: "Error creating preferences",
          details: error.message,
        });
        return;
      }

      res
        .status(201)
        .json({ message: "Preferences created successfully", data });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getFriendsData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { friends_list } = req.query;

    if (!friends_list || typeof friends_list !== "string") {
      res
        .status(400)
        .json({ error: "Missing or invalid friends_list parameter" });
      return;
    }

    // Rozdziel listę ID po przecinku i usuń ewentualne białe znaki
    const friendsIds = friends_list.split(",").map((id) => id.trim());

    if (friendsIds.length === 0) {
      res.status(200).json({ message: "No friends found", data: [] });
      return;
    }

    // Pobranie danych użytkowników na podstawie przekazanych ID
    const { data: friendsData, error: friendsError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", friendsIds);

    if (friendsError) {
      res.status(500).json({
        error: "Error fetching friends data",
        details: friendsError.message,
      });
      return;
    }

    res.status(200).json({
      message: "Friends data retrieved successfully",
      data: friendsData,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.sub;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id" });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id);

    if (userError) {
      res.status(500).json({
        error: "Error fetching user data",
        details: userError.message,
      });
      return;
    }

    const user_image = userData?.[0]?.avatar_url;

    if (user_image) {
      const { error: deleteImageError } = await supabase.storage
        .from("avatars")
        .remove([user_image]);

      if (deleteImageError) {
        res.status(500).json({
          error: "Error deleting user image",
          details: deleteImageError.message,
        });
        return;
      }
    }

    const { error: deleteTripImagesError } = await supabase.storage
      .from("trip-images")
      .remove([`user-images/${user_id}/*`]);

    if (deleteTripImagesError) {
      res.status(500).json({
        error: "Error deleting trip images",
        details: deleteTripImagesError.message,
      });
      return;
    }

    const { error: deletePreferencesError } = await supabase
      .from("user_travel_preferences")
      .delete()
      .eq("id", user_id);

    if (deletePreferencesError) {
      res.status(500).json({
        error: "Error deleting user preferences",
        details: deletePreferencesError.message,
      });
      return;
    }

    const { data: tripData, error: tripError } = await supabase
      .from("profiles_travel_data")
      .select("*")
      .eq("user_id", user_id);

    if (tripError) {
      res.status(500).json({
        error: "Error fetching user trip data",
        details: tripError.message,
      });
      return;
    }

    const tripIds = tripData?.map((trip) => trip. id);
    if (tripIds && tripIds.length > 0) {
      const { error: deleteTripError } = await supabase
        .from("travel_data")
        .delete()
        .in("id", tripIds);

      if (deleteTripError) {
        res.status(500).json({
          error: "Error deleting user trip data",
          details: deleteTripError.message,
        });
        return;
      }
    }

    const { error: deleteTripDataError } = await supabase
      .from("profiles_travel_data")
      .delete()
      .eq("user_id", user_id);

    if (deleteTripDataError) {
      res.status(500).json({
        error: "Error deleting user trip data #2",
        details: deleteTripDataError.message,
      });
      return;
    }

    const { error: deleteMessages } = await supabase
      .from("messages")
      .delete()
      .eq("user_id", user_id);

    if (deleteMessages) {
      res.status(500).json({
        error: "Error deleting user messages",
        details: deleteMessages.message,
      });
      return;
    }

    const { error: deleteChatMessages } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user_id);

    if (deleteChatMessages) {
      res.status(500).json({
        error: "Error deleting user chat messages",
        details: deleteChatMessages.message,
      });
      return;
    }

    const { data, error } = await supabase
      .from("travel_data")
      .select(
        `
          id,
          title,
          start_date,
          end_date,
          image,
          type_of_trip,
          friends_list,
          profiles_travel_data!inner (
            profiles!inner (
              id,
              username
            )
          )
        `
      )
      .contains("friends_list", [user_id]);

    if (error) {
      res
        .status(500)
        .json({ error: "Error fetching trips", details: error.message });
      return;
    }

    if (data && data.length > 0) {
      const tripIds = data.map((trip) => trip.id);
      const { data: updateData, error: updateError } = await supabase
        .from("travel_data")
        .update({
          friends_list: supabase.rpc("array_remove", {
            array: "friends_list",
            value: user_id,
          }),
        })
        .in("id", tripIds);
    }

    // Usunięcie użytkownika z tabeli profiles
    const { error: deleteProfileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user_id);

    if (deleteProfileError) {
      res.status(500).json({
        error: "Error deleting user profile",
        details: deleteProfileError.message,
      });
      return;
    }

    // Usunięcie użytkownika z tabeli auth.users
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      user_id
    );
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};
