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
    <div className="w-1/5 xl:w-[30%] 2xl:w-1/5 p-4 overflow-y-auto h-screen pt-24 scrollbar-hide">
      <TripTimeLine selectedPlaces={selectedPlaces}/>
    </div>
  );
}
