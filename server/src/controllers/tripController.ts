import supabase from "../utils/supabase";
import { Request, Response } from 'express';

export const createTripData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, title, start_date, end_date, type_of_trip, image } = req.body;
  
      if (!user_id || !start_date || !end_date || !title || !type_of_trip) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
  
      const { data: travelData, error: travelError } = await supabase
        .from('travel_data')
        .insert([{ title,  start_date, end_date, type_of_trip, image }])
        .select()
        .single();
  
      if (travelError) throw travelError;
  
      const { error: linkError } = await supabase.from('profiles_travel_data').insert([
        { user_id, travel_id: travelData.id }
      ]);
  
      if (linkError) throw linkError;
  
      res.status(201).json({ message: "Trip added successfully", travelData });
  
    } catch (error) {
      res.status(500).json({error});
    }
  };

  export const getTripCodeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { trip_id } = req.params;
        const { data, error } = await supabase
            .from("travel_data")
            .select("trip_code")
            .eq("id", trip_id) 
            .single(); 

        if (error) {
            res.status(500).json({ error: "Error fetching trip code", details: error.message });
            return;
        }

        res.status(200).json({ trip_code: data.trip_code });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};