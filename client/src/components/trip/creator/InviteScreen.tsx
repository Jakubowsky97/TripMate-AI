interface InviteScreenProps {
    nextStep: () => void;
    prevStep: () => void;
}

const InviteFriends = ({ nextStep, prevStep } : InviteScreenProps) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
        <button onClick={prevStep} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Next</button>
    </div>
);

export default InviteFriends;