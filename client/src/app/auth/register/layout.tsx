"use client";
import SignUpStep from "../../../components/ui/SignUpStep";
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
    { step: 3, text: "Confirm your email", description: "Please check your email inbox" },
    { step: 4, text: "Set your preferences", description: "Choose your interests to get personalized AI recommendations." },
    { step: 5, text: "Start planning your trips", description: "Explore AI-recommended accommodations and attractions." },
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

      <div className="flex-1 flex flex-col justify-center relative">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[url(/img/background/Wenecja.jpg)] bg-cover bg-center opacity-25 z-0" />

        {/* Signup Form */}
        <div className="z-10 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
