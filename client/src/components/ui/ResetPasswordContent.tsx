"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ResetPasswordContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user_id = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;

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
                    `http://localhost:5000/api/auth/reset-password?token_hash=${token_hash}&next=${next}&user_id=${user_id}`
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