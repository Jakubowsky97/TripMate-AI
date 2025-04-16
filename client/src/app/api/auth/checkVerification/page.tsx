'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function CheckVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userIdFromStorage = localStorage.getItem('user_id');
      setUserId(userIdFromStorage);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/checkEmail`,
          {
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        if (data.isConfirmed === true) {
          router.push('/auth/register/step-4');
        } else {
          router.push('/auth/register/step-3?error=Email%20not%20confirmed');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, router, userId]);

  if (loading) return <p>Checking...</p>;
  if (error) return <p>Error: {error}</p>;

  return null;
}

export default function CheckVerification() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CheckVerificationContent />
    </Suspense>
  );
}
