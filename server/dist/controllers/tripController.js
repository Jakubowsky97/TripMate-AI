"use strict";
//File: server/src/controllers/tripController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.joinTrip = exports.updateTravelData = exports.getTripById = exports.getTripsForUser = exports.getAllTrips = exports.getTripCodeById = exports.createTripData = void 0;
const supabase_1 = __importDefault(require("../utils/supabase"));
const createTripData = async (req, res) => {
    try {
        const user_id = req.user?.sub;
        if (!user_id) {
            res.status(400).json({ error: "Missing user_id" });
            return;
        }
        const { data: travelData, error: travelError } = await supabase_1.default
            .from("travel_data")
            .insert([{ title: "New Trip", status: "draft" }])
            .select()
            .single();
        if (travelError)
            throw travelError;
        const { error: linkError } = await supabase_1.default
            .from("profiles_travel_data")
            .insert([{ user_id, travel_id: travelData.id }]);
        if (linkError)
            throw linkError;
        res.status(201).json({ message: "Trip added successfully as Draft", travelData });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.createTripData = createTripData;
const getTripCodeById = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const { data, error } = await supabase_1.default
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
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};
exports.getTripCodeById = getTripCodeById;
const getAllTrips = async (req, res) => {
    try {
        const user_id = req.user?.sub;
        if (!user_id || typeof user_id !== "string") {
            res.status(400).json({ error: "Missing or invalid user_id parameter" });
            return;
        }
        const { data, error } = await supabase_1.default
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
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};
exports.getAllTrips = getAllTrips;
const getTripsForUser = async (req, res) => {
    try {
        const user_id = req.user?.sub;
        if (!user_id || typeof user_id !== "string") {
            res.status(400).json({ error: "Missing or invalid user_id parameter" });
            return;
        }
        const { data, error } = await supabase_1.default
            .from("travel_data")
            .select(`
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
        `)
            .contains("friends_list", [user_id]);
        if (error) {
            res
                .status(500)
                .json({ error: "Error fetching trips", details: error.message });
            return;
        }
        res.status(200).json({ message: "Data fetch successful", data });
    }
    catch (err) {
        console.error("Internal server error:", err);
        res
            .status(500)
            .json({
            error: "Internal server error",
            details: err.message,
        });
    }
};
exports.getTripsForUser = getTripsForUser;
const getTripById = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const user_id = req.user?.sub;
        // Sprawdzenie, czy wszystkie wymagane dane są dostępne
        if (!trip_id || !user_id) {
            res.status(400).json({ error: "Missing trip_id or user_id" });
            return;
        }
        // Pobranie danych wycieczki oraz sprawdzenie, czy user_id jest właścicielem wycieczki lub w liście przyjaciół
        const { data: tripData, error: tripError } = await supabase_1.default
            .from("travel_data")
            .select(`
        id,
        countries,
        cities,
        places_to_stay,
        title,
        start_date,
        end_date,
        image,
        type_of_trip,
        friends_list,
        profiles_travel_data!inner (user_id)
      `)
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
        if (tripData.profiles_travel_data[0].user_id === user_id ||
            tripData.friends_list.includes(user_id)) {
            res
                .status(200)
                .json({ message: "Trip data fetched successfully", data: tripData });
        }
        else {
            res
                .status(403)
                .json({ error: "User is not the owner or not in the friends list" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({
            error: "Internal server error",
            details: err.message,
        });
    }
};
exports.getTripById = getTripById;
const updateTravelData = async (trip_id, { ...travelData }) => {
    if (!trip_id || typeof trip_id !== "string") {
        throw new Error("Missing or invalid trip_id");
    }
    if (Object.keys(travelData).length === 0) {
        throw new Error("No travel data provided");
    }
    const { data, error } = await supabase_1.default
        .from("travel_data")
        .upsert([{ id: trip_id, ...travelData, status: "confirmed" }], { onConflict: "id" });
    if (error) {
        throw new Error(`Error saving travel data: ${error.message}`);
    }
    console.log("Travel data saved successfully", data);
};
exports.updateTravelData = updateTravelData;
const joinTrip = async (req, res) => {
    try {
        const user_id = req.user?.sub;
        const { trip_code } = req.body;
        if (!user_id || typeof trip_code !== "string" || trip_code.length !== 6) {
            res.status(400).json({ error: "Invalid user_id or trip_code" });
            return;
        }
        // Sprawdź, czy taka wycieczka istnieje
        const { data: trip, error: tripError } = await supabase_1.default
            .from("travel_data")
            .select("id, friends_list")
            .eq("trip_code", trip_code)
            .single();
        if (tripError || !trip) {
            res.status(404).json({ error: "Trip not found with provided code" });
            return;
        }
        // Sprawdź, czy użytkownik już dołączył
        const alreadyJoined = trip.friends_list?.includes(user_id);
        if (alreadyJoined) {
            res.status(400).json({ error: "User already joined this trip" });
            return;
        }
        // Dodaj użytkownika do listy znajomych (friends_list)
        const updatedFriendsList = [...(trip.friends_list || []), user_id];
        const { error: updateError } = await supabase_1.default
            .from("travel_data")
            .update({ friends_list: updatedFriendsList })
            .eq("id", trip.id);
        if (updateError) {
            throw updateError;
        }
        res.status(200).json({ message: "Successfully joined the trip", trip_id: trip.id });
    }
    catch (error) {
        console.error("Join trip error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};
exports.joinTrip = joinTrip;
const getUserProfile = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        if (!user_id || typeof user_id !== "string") {
            res.status(400).json({ error: "Missing or invalid user_id" });
            return;
        }
        const { data, error } = await supabase_1.default
            .from("profiles")
            .select("*")
            .eq("id", user_id);
        if (error) {
            res.status(500).json({ error: "Error updating user profile", details: error.message });
            return;
        }
        res.status(200).json({ message: "User profile updated successfully", data });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};
exports.getUserProfile = getUserProfile;
