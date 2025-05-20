import { useState } from "react";

export default function TripShareModal({ shareCode, onClose }: { shareCode: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Share Trip</h2>
        <p className="mb-2">Share this code with others:</p>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded justify-between">
          <span className="font-mono text-lg break-all">{shareCode}</span>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:underline"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
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
