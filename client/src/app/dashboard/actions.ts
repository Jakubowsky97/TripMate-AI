"use server";
import { createClient } from "@/utils/supabase/server";
import { useEffect } from "react";

export async function sendResetPassword(email: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth
    .resetPasswordForEmail(email);

    if (error) {
        throw error;
    }

        supabase.auth.onAuthStateChange(async (event: string, session: any) => {
          if (event == "PASSWORD_RECOVERY") {
            const newPassword = prompt("What would you like your new password to be?");
            if (newPassword) {
              const data = await resetPassword(newPassword);
              if (data) alert("Password updated successfully!");
            } else {
              alert("Password cannot be empty.");
            }
     
            if (error) alert("There was an error updating your password.")
          }
        })
}

export async function resetPassword(newPassword: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth
    .updateUser({ password: newPassword})

    if (error) {
        throw error;
    }
    
    return data;
}