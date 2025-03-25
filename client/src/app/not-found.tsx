"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      router.push("/");
    }

    return () => clearInterval(interval);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <p className="mt-2">Redirecting to the homepage in {countdown} seconds...</p>
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}