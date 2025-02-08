"use client";
import SignUpStep from "@/components/ui/SignUpStep";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Pobieranie aktualnego kroku z URL
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;
  
  const steps = [
    { step: 1, text: "Your details", description: "Please provide your name and email" },
    { step: 2, text: "Choose a password", description: "Must be at least 8 characters" },
    { step: 3, text: "Set your preferences", description: "Choose your interests to get personalized AI recommendations." },
    { step: 4, text: "Start planning your trips", description: "Explore AI-recommended accommodations and attractions." },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#f9fbfc] shadow-md p-6 hidden lg:block">
        <h1 className="text-2xl font-bold mb-4">TripMate AI</h1>
        <ul className="space-y-4 mt-16">
          {steps.map(({ step, text, description }) => (
            <SignUpStep key={step} step={step} text={text} description={description} active={step === currentStep} />
          ))}
        </ul>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center">
          {children}
      </div>
    </div>
  );
}
