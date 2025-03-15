import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
interface InviteScreenProps {
    prevStep: () => void;
}

const InviteFriends = ({ prevStep }: InviteScreenProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const [tripCode, setTripCode] = useState("");
    const router = useRouter();

    const getTripCode = () => {
        
    }

    const nextStep = () => {
        router.push(`/trip/${tripCode}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tripCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };
    return (
        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg items-center">
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
                <p className="text-[#51605D]">Share your trip code and invite friends to join you.</p>
            </div>
            <div className="flex flex-col items-center">
                <label className="block text-base text-[#142F32] font-bold mb-1">Trip code</label>
                <div className="flex items-center flex-row bg-gray-100 px-4 py-2 rounded-lg gap-4">
                    <p className="text-gray-800 font-mono">{tripCode}</p>
                    <FaRegCopy 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    />

                </div>
            </div>
            <div>
                <button onClick={prevStep} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Plan your trip</button>
            </div>
        </div>
    )
};

export default InviteFriends;
