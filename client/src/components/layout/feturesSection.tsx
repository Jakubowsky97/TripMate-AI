import { motion } from "framer-motion";
import { FaBrain, FaMapMarkedAlt, FaShare, FaUsers } from "react-icons/fa";

const features = [
    {
      name: "Track Your Travels",
      description:
        "Keep a record of all the countries and places you've visited, visualized on an interactive map.",
      icon: FaMapMarkedAlt,
    },
    {
      name: "AI-Powered Recommendations",
      description:
        "Get personalized travel suggestions based on your past trips and preferences.",
      icon: FaBrain,
    },
    {
      name: "Seamless Sharing",
      description:
        "Easily share your travel experiences with friends and family through photos and videos.",
      icon: FaShare,
    },
    {
      name: "Group Trip Collaboration",
      description:
        "Plan trips with friends, share itineraries, and organize travel logistics together.",
      icon: FaUsers,
    },
  ];

  export default function FeatureSection() {
    return (
      <div className="bg-[#142F32] py-24 sm:py-32 text-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-[#E3FFCC]">Explore More, Together</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-[#f8f8f8] sm:text-5xl lg:text-balance">
                Why TripMate AI?
            </p>
            <p className="mt-6 text-lg/8 text-[#f8f8f8]">
            Track your travels as a group, get personalized recommendations, and make every second of your adventure a shared memory.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div 
                key={feature.name} 
                className="relative pl-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <dt className="text-xl font-semibold">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-[#E3FFCC]">
                      <feature.icon aria-hidden="true" className="size-6 text-[#142F32]" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base/7">{feature.description}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    )
  }