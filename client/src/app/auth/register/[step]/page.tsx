"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmEmailForm, SignUpForm, SignUpPasswordForm, SignUpPrefForm } from "../../../../components/auth/SignUpForm";

export default function RegisterStepPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // Użyj useParams zamiast Promise<{ step: string }>
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const stepMatch = pathname.match(/step-(\d+)/);
    const stepNumber = stepMatch ? parseInt(stepMatch[1], 10) : 1;
    setCurrentStep(stepNumber);
  }, [pathname]);

  const steps = 4;

  const handleNext = () => {
    if (currentStep < steps) {
      router.push(`/auth/register/step-${currentStep + 1}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SignUpForm onClick={handleNext} />;
      case 2:
        return <SignUpPasswordForm onClick={handleNext} />;
      case 3:
        return <ConfirmEmailForm onClick={handleNext} />;
      case 4:
        return <SignUpPrefForm onClick={handleNext} />;
      default:
        return <p>Invalid step</p>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {renderStepContent()}
    </div>
  );
}
