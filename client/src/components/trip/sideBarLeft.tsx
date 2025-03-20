'use client';

interface SidebarLeftProps {
  selectedPlaces: { name: string; type: string }[];
}

export default function SidebarLeft({ selectedPlaces }: SidebarLeftProps) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Selected Places</h2>
      {selectedPlaces.length > 0 ? (
        selectedPlaces.map((place, index) => (
          <div key={index} className="bg-white p-3 rounded-md shadow-md mb-3">
            <h3 className="font-bold">{place.name}</h3>
            <p className="text-gray-600">{place.type}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No places selected</p>
      )}
    </div>
  );
}
