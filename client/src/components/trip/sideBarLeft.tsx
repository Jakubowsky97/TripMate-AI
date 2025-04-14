'use client';

import TripTimeLine from "../ui/TripTimeLine";

interface SidebarLeftProps {
  selectedPlaces: { 
    city: string;
    country: string;
    places: {
      city: string;
      name: string;
      type: string;
      start_date: string;
      end_date: string;
      is_start_point: boolean;
      is_end_point: boolean;
      country: string;
      weather: { temp: string; condition: string };
      coordinates: any[];
      date: string;
    }[];
  }[];
  mapRef: React.MutableRefObject<any>;
}


export default function SidebarLeft({ selectedPlaces, mapRef }: SidebarLeftProps) {
  return (
    <div className="w-1/5 xl:w-[30%] 2xl:w-1/5 p-4 overflow-y-auto h-screen pt-24 scrollbar-hide">
      <TripTimeLine selectedPlaces={selectedPlaces} mapRef={mapRef}/>
    </div>
  );
}
