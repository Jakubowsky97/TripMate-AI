import { FaCompass, FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

const TripCreatorLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 flex flex-row justify-between px-5 md:px-12 xl:px-32 py-3 bg-white shadow-md z-50">
                <div className="flex flex-row items-center gap-2">
                    <FaCompass size={28} className="text-[#f97316]"/>
                    <h1 className="text-2xl font-bold text-[#1f2937]">TripMate AI</h1>
                </div>
                <div className="flex flex-row items-center gap-6 text-[#4b5563]">
                    <button>
                        <FaRegUser size={22}/>
                    </button>
                    <button>
                        <FaRegBell size={22}/>
                    </button>
                </div>
            </div>

            {/* Dodanie paddingu, aby treść nie nachodziła na nagłówek */}
            <div className="pt-14">
                {children}
            </div>
        </div>
    );
}

export default TripCreatorLayout;