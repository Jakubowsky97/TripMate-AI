"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSessionOrRedirect } from "@/app/auth/actions";

const ResetPasswordContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user_id = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;
    const access_token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    const refresh_token = typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null;

    useEffect(() => {
        const checkSession = async () => {
            await checkSessionOrRedirect({ accessToken: access_token || "", refreshToken: refresh_token || "" });
        }

        checkSession();
    }, [access_token, refresh_token])

    useEffect(() => {
        const resetPassword = async () => {
            const token_hash = searchParams.get("token_hash");
            const next = searchParams.get("next") || "/";

            if (!token_hash) {
                setError("Invalid reset password link");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password?token_hash=${token_hash}&next=${next}&user_id=${user_id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Reset password failed");
                }

                router.push(data.next);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        resetPassword();
    }, [searchParams, router, user_id]);

    if (loading) return <p>Resetting password...</p>;
    if (error) return <p>Error: {error}</p>;

    return <p>Password reset successful!</p>;
};

export default ResetPasswordContent;