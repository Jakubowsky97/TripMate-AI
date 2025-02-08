"use client";

import { SignUpForm, SignUpPasswordForm, SignUpPrefForm } from "@/components/auth/SignUpForm";
import { useRouter, useParams, usePathname } from "next/navigation";

export default function RegisterStepPage({ params }: { params: { step: string }}) {
  const { step } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // Pobieranie aktualnego kroku z URL
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;

  const steps = 4; // Liczba kroków rejestracji

  const renderStepContent = () => {
    switch (step) {
      case "step-1":
        return (
            <SignUpForm onClick={handleNext}/>
        );
      case "step-2":
        return (
            <SignUpPasswordForm onClick={handleNext}/>
        );
      case "step-3":
        return (
            <SignUpPrefForm onClick={handleNext}/>
        );
      case "step-4":
        return (
            <SignUpForm onClick={handleNext}/>
        );
      default:
        return <p>Invalid step</p>;
    }
  };


  const handleNext = () => {
    if (currentStep < steps){
      router.push(`/auth/register/step-${currentStep + 1}`);
      console.log(currentStep);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {renderStepContent()}
    </div>
  );
}
