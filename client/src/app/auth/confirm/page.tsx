"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

const Loading = () => <p>Loading...</p>;

const ConfirmPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user_id, setUser_id] = useState<string | null>(null);

    useEffect(() => {
        setUser_id(localStorage.getItem('user_id'));
    }, []);
  

    useEffect(() => {
        const confirmEmail = async () => {
            const token_hash = searchParams.get("token_hash");
            const type = searchParams.get("type");
            const next = searchParams.get("next") || "/";

            if (!token_hash || !type) {
                setError("Invalid confirmation link");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token_hash=${token_hash}&type=${type}&next=${next}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Verification failed");
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

        confirmEmail();
    }, [searchParams, router, user_id]);

    if (loading) return <p>Verifying...</p>;
    if (error) return <p>Error: {error}</p>;

    return null;
};

export default function ConfirmPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ConfirmPageContent />
        </Suspense>
    );
}
