import Step from "../ui/Step";

const steps = [
    {
        step: 1,
        name: "Sign Up",
        description: "Create your account in just a few easy steps. Get started with your travel profile!"
    },
    {
        step: 2,
        name: "Personalize Your Account",
        description: "Fill out your preferences for accommodations and attractions. TripMate AI will tailor recommendations based on your style."
    },
    {
        step: 3,
        name: "Add Friends & Family",
        description: "Invite friends and family to join your trip planning. Collaborate on creating the perfect travel itinerary together!"
    },
    {
        step: 4,
        name: "Create Your Itinerary",
        description: "Organize your trip by creating a day-by-day itinerary with activities, meals, and accommodations."
    },
]

interface HowItWorksSectionProps {
    darkMode: boolean;
}

export default function HowItWorksSection({darkMode}: HowItWorksSectionProps) {
    return (
        <div className={`${darkMode ? "text-[#f8f8f8]" : "bg-[#f8f8f8]"} py-24 sm:py-32 text-[#142F32]`}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl pl-4 lg:text-center sm:pl-0">
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
                        How it works
                    </p>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl text-[#777C90]">
                        Get started with 4 easy steps.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:gap-y-4">
                        {steps.map((step, index) => (
                            <Step key={index} step={step.step} name={step.name} description={step.description} darkMode={darkMode}/>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}