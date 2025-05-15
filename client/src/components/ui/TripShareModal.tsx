export default function TripShareModal({ shareCode, onClose }: { shareCode: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Share Trip</h2>
        <p className="mb-2">Share this code with others:</p>
        <div className="font-mono text-lg bg-gray-100 p-3 rounded text-center">
          {shareCode}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
