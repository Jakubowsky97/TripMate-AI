import { Request, Response } from "express";
import supabase from "../utils/supabase";


export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, username, avatar_url, email, full_name } = req.body;  

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
        if (username && (user.username != username)) updateFields.username = username;
        if (avatar_url && (user.avatar_url != avatar_url)) updateFields.avatar_url = avatar_url;
        if (email && (user.email != email)) updateFields.email = email;
        if (full_name && (user.full_name != full_name)) updateFields.full_name = full_name

        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        updateFields.updated_at = new Date();

        const { data, error } = await supabase
            .from("profiles")
            .update(updateFields)
            .eq("id", user_id);

        if(updateFields.email) {
            const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
                email: updateFields.email
            });

            if (error) {
                res.status(500).json({ error: "Error updating email", details: error.message });
                return;
            }
        }

        if (error) {
            res.status(500).json({ error: "Error updating user profile", details: error.message });
            return;
        }

        res.status(200).json({ message: "User profile updated successfully", data });

    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.query;  
        const  session = await supabase.auth.getSession()

        if (!user_id || typeof user_id !== "string") {
            res.status(400).json({ error: "Missing or invalid user_id" });
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
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