import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "TripMate AI",
  description: "TripMate AI is an AI-powered web application that helps groups plan trips effortlessly. It provides intelligent itinerary suggestions, optimized routes, expense tracking, and real-time collaboration to make travel planning smooth and enjoyable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
