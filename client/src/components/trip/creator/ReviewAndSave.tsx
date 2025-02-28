interface ReviewAndSaveProps {
    prevStep: () => void;
}

const ReviewAndSave = ({ prevStep } : ReviewAndSaveProps) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Review & Save</h2>
        <button onClick={prevStep} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Save Trip</button>
    </div>
);

export default ReviewAndSave;