// TripTimeline.tsx

import TripPlace from "./TripPlace";

interface TripTimelineProps {
  selectedPlaces: {
    name: string;
    type: string;
    date: string;
    weather: { temp: string; condition: string };
    places: [string, string]; // Hotel i Restauracja
    coordinates: number[];
  }[];
}

const TripTimeline = ({ selectedPlaces }: TripTimelineProps) => {
  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Trip Timeline</h2>
      <div className="absolute left-3 top-12 bottom-0 w-[2px] bg-[#ffedd5]"></div> {/* Linia łącząca ikony */}
      {selectedPlaces.map((place, index) => (
          <TripPlace key={index} place={place} index={index}  totalPlaces={selectedPlaces.length}/>
        ))} 
        <p className="text-gray-500">No places selected</p>
    </div>
  );
};

export default TripTimeline;
