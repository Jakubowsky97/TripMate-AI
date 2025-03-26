"use server";
import { createClient } from "@/utils/supabase/server";

export async function sendResetPassword(email: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_PAGE_URL}/dashboard/reset-password`,
    });

    if (error) {
        throw error;
    }
}