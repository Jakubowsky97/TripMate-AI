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
