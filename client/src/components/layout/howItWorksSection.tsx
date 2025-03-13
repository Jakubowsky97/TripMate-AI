import Step from "../ui/Step";

const steps = [
    {
        step: 1,
        name: "🌊 Sign Up for Adventure",
        description: "Create your account and start your journey to paradise!"
    },
    {
        step: 2,
        name: "🌴 Personalize Your Paradise",
        description: "Set your travel vibe and get tailor-made trip suggestions."
    },
    {
        step: 3,
        name: "👯‍♂️ Add Your Travel Crew",
        description: "Invite your besties and family to join the adventure."
    },
    {
        step: 4,
        name: "🗺️ Plan Your Dream Escape",
        description: "Craft the perfect itinerary with epic activities and dreamy stays."
    },
]

interface HowItWorksSectionProps {
    darkMode: boolean;
}

export default function HowItWorksSection({darkMode}: HowItWorksSectionProps) {
    return (
        <div className={`${darkMode ? "text-[#f8f8f8]" : "bg-[#fefaee]"} py-24 sm:py-32 text-[#142F32]`}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl pl-4 lg:text-center sm:pl-0">
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
                        🌟 How It Works 🌟
                    </p>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl text-[#777C90]">
                        Plan your perfect getaway in just 4 easy-breezy steps.
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
