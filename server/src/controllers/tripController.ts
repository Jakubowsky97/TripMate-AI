import supabase from "../utils/supabase";
import { Request, Response } from "express";

export const createTripData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, title, start_date, end_date, type_of_trip, image } =
      req.body;

    if (!user_id || !start_date || !end_date || !title || !type_of_trip) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const { data: travelData, error: travelError } = await supabase
      .from("travel_data")
      .insert([{ title, start_date, end_date, type_of_trip, image }])
      .select()
      .single();

    if (travelError) throw travelError;

    const { error: linkError } = await supabase
      .from("profiles_travel_data")
      .insert([{ user_id, travel_id: travelData.id }]);

    if (linkError) throw linkError;

    res.status(201).json({ message: "Trip added successfully", travelData });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getTripCodeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { trip_id } = req.params;
    const { data, error } = await supabase
      .from("travel_data")
      .select("trip_code")
      .eq("id", trip_id)
      .single();

    if (error) {
      res
        .status(500)
        .json({ error: "Error fetching trip code", details: error.message });
      return;
    }

    res.status(200).json({ trip_code: data.trip_code });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getAllTrips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id parameter" });
      return;
    }

    const { data, error } = await supabase
      .from("profiles_travel_data")
      .select("travel_data(*)")
      .eq("user_id", user_id);

    if (error) {
      res
        .status(500)
        .json({ error: "Error fetching trip code", details: error.message });
      return;
    }

    res.status(200).json({ message: "data fetch successful", data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getLatestTrips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id parameter" });
      return;
    }

    const { data, error } = await supabase
      .from("profiles_travel_data")
      .select("travel_data(*)")
      .eq("user_id", user_id)
      .limit(4);

    if (error) {
      res
        .status(500)
        .json({ error: "Error fetching trip code", details: error.message });
      return;
    }

    res.status(200).json({ message: "data fetch successful", data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getTripsForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({ error: "Missing or invalid user_id parameter" });
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

    res.status(200).json({ message: "Data fetch successful", data });
  } catch (err) {
    console.error("Internal server error:", err);
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (err as Error).message,
      });
  }
};

export const getTripById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { trip_id } = req.params;
    const { user_id } = req.query;

    // Sprawdzenie, czy wszystkie wymagane dane są dostępne
    if (!trip_id || !user_id) {
      res.status(400).json({ error: "Missing trip_id or user_id" });
      return;
    }

    // Pobranie danych wycieczki oraz sprawdzenie, czy user_id jest właścicielem wycieczki lub w liście przyjaciół
    const { data: tripData, error: tripError } = await supabase
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
        profiles_travel_data!inner (user_id)
      `
      )
      .eq("id", trip_id)
      .single();

    if (tripError) {
      res
        .status(500)
        .json({
          error: "Error fetching trip data",
          details: tripError.message,
        });
      return;
    }

    // Sprawdzenie, czy użytkownik jest właścicielem wycieczki lub w liście przyjaciół
    if (
      tripData.profiles_travel_data[0].user_id === user_id ||
      tripData.friends_list.includes(user_id)
    ) {
      res
        .status(200)
        .json({ message: "Trip data fetched successfully", data: tripData });
    } else {
      res
        .status(403)
        .json({ error: "User is not the owner or not in the friends list" });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (err as Error).message,
      });
  }
};
