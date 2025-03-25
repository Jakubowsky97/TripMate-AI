import type { Metadata } from "next";
import "@/app/globals.css"
import { DarkModeProvider } from "@/components/ui/DarkModeContext";

export const metadata: Metadata = {
  title: "TripMate AI – Smart Travel Planner | AI-Powered Trip Planning",
  description: "TripMate AI is your intelligent travel companion, helping you plan personalized trips, discover top destinations, and create custom itineraries with AI-powered suggestions. Start planning your dream vacation today!",
  keywords: "trip planner AI, AI travel planner, AI trip planning, AI-powered trip planner, smart travel planning, AI itinerary planner, best AI trip planner, AI travel assistant, AI travel recommendations, travel AI tools, trip planner online, best travel planner, travel planning website, interactive trip planner, travel planning software, free travel planner, trip organization app, create travel itinerary, trip itinerary builder, best trip planner websites, personalized travel recommendations, AI custom trip planner, smart travel itinerary, AI-powered itinerary builder, best personalized travel planner, AI-based trip suggestions, AI travel guide, trip recommendation engine, AI vacation planner, smart itinerary generator, group trip planner, travel planning with friends, collaborative trip planning, best group travel apps, AI group trip organizer, travel coordination app, trip planning with AI, group travel itinerary maker, multi-destination trip planner, shared travel planning, trip planning AI assistant, AI travel chatbot, AI map trip planner, AI-powered vacation planner, AI travel scheduler, vacation AI generator, AI-powered booking assistant, smart route planner AI, AI hotel recommendation, AI travel cost estimator, best places to travel 2025, travel bucket list ideas, where to travel next, vacation planning tips, best travel destinations AI, AI travel trends 2025, unique travel destinations, hidden travel gems, AI-powered city guides, travel adventure AI, budget travel planner, cheap travel deals AI, affordable vacation planner, AI travel discounts, AI budget travel tips, cost-effective trip planning, AI travel cost analysis, best budget-friendly destinations, find cheap flights AI, AI travel savings tool, AI in tourism, travel tech innovations, AI for travel agencies, future of travel AI, AI-powered trip experiences, how AI is changing travel, machine learning in travel, AI vacation planning.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <DarkModeProvider>
              {children}
          </DarkModeProvider>
      </body>
    </html>
  );
}