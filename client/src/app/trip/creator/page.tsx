"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "@/components/ui/DarkModeContext";
import InviteFriends from "@/components/trip/creator/InviteScreen";
import ReviewAndSave from "@/components/trip/creator/ReviewAndSave";
import TripDetails from "@/components/trip/creator/TripDetals";

const steps = ["Trip Details", "Review & Save", "Invite Friends",];

export default function TripCreationFlow() {
    const { darkMode } = useDarkMode();
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <TripDetails nextStep={nextStep} />;
            case 1:
                return <ReviewAndSave nextStep={nextStep} prevStep={prevStep} />;
            case 2:
                return <InviteFriends />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? "bg-[#1a1e1f] text-white" : "bg-white text-black"}`}>
            <div className="max-w-4xl mx-auto p-8">
                <div className="flex justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={step} className={`text-sm font-semibold ${index === currentStep ? "text-blue-500" : "text-gray-400"}`}>
                            {step}
                        </div>
                    ))}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
                    {renderStep()}
                </motion.div>
            </div>
        </div>
    );
};