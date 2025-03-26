'use client';

import TripTimeLine from "../ui/TripTimeLine";

interface SidebarLeftProps {
  selectedPlaces: { 
    name: string;
    type: string;
    date: string;
    weather?: { temp: string; condition: string };
    places?: string[]; // Make it optional
    coordinates: number[];
  }[];
}


export default function SidebarLeft({ selectedPlaces }: SidebarLeftProps) {
  return (
    <div className="w-1/5 p-4 overflow-y-auto">
      <TripTimeLine selectedPlaces={selectedPlaces}/>
    </div>
  );
}
