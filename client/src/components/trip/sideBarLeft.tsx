"use client";

import { use, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TripTimeLine from "../ui/TripTimeLine";
import PlaceDetailView from "../ui/PlaceDetailView";
import { FaArrowLeft } from "react-icons/fa";


interface SidebarLeftProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  selectedPlaces: any[]; // Type to customize
  setSelectedPlaces: React.Dispatch<React.SetStateAction<any[]>>; // Type to customize
  tripId: string;
}

interface ViewState {
  type: "timeline" | "search" | "place-detail";
  data?: any; // Will hold place details when in place-detail view
}

export default function SidebarLeft({ 
  mapRef, 
  selectedPlaces,
  setSelectedPlaces, 
  tripId
}: SidebarLeftProps) {
  const [view, setView] = useState<ViewState>({ type: "timeline" });

  const handleBack = () => {
    setView({ type: "timeline" })
  };

  // Call this when a place on the map is clicked
  const handlePlaceClick = useCallback((placeData: any) => {
    setView({ 
      type: "place-detail", 
      data: placeData 
    });
  }, [setView]);

  // Handle adding a place to the trip
const handleAddPlaceToTrip = (placeData: any) => {
  const cityIndex = selectedPlaces.findIndex(
    cityObj => cityObj.city === placeData.city
  );

  if (cityIndex !== -1) {
    const updatedSelectedPlaces = [...selectedPlaces];
    const places = updatedSelectedPlaces[cityIndex].places;

    if (places.length >= 1) {
      // Insert before the last item
      places.splice(places.length - 1, 0, placeData);
    } else {
      // If there's only 0 or 1 place, just push
      places.push(placeData)
    }

    setSelectedPlaces(updatedSelectedPlaces);
  } else if(!placeData.is_end_point || !placeData.is_start_point) {
    const newCityEntry = {
      city: placeData.city || "Unknown City",
      country: placeData.country || "Unknown Country",
      places: [placeData]
    }

    const updatedSelectedPlaces = [...selectedPlaces]
    const lastCityEntry = updatedSelectedPlaces[updatedSelectedPlaces.length - 1];
    updatedSelectedPlaces.pop();
    updatedSelectedPlaces.push(newCityEntry);
    updatedSelectedPlaces.push(lastCityEntry);
    setSelectedPlaces(updatedSelectedPlaces)
  } else {
    const newCityEntry = {
      city: placeData.city || "Unknown City",
      country: placeData.country || "Unknown Country",
      places: [placeData]
    };
    setSelectedPlaces([...selectedPlaces, newCityEntry]);
  }

  setView({ type: "timeline" });
};

useEffect(() => {
  const interval = setInterval(() => {
    if (mapRef.current) {
      (mapRef.current as any).customHandlers = {
        ...(mapRef.current as any).customHandlers,
        handlePlaceClick
      };
      clearInterval(interval);
    }
  }, 100); // co 100ms sprawdza mapRef

  return () => clearInterval(interval);
}, [mapRef, handlePlaceClick]);


useEffect(() => {
  console.log("Selected Places:", selectedPlaces);
}, [selectedPlaces])
  


  return (
    <div className="w-1/5 xl:w-[30%] 2xl:w-1/5 p-4 overflow-y-auto h-screen pt-24 scrollbar-hide">
      <AnimatePresence mode="wait">
        {view.type === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <TripTimeLine selectedPlaces={selectedPlaces} mapRef={mapRef} tripId={tripId} />
          </motion.div>
        )}

        {view.type === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <FaArrowLeft
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={handleBack}/>
            </div>
            <div
              id="place-list-container"
              className="space-y-2 max-h-[75vh] overflow-y-auto pr-1"
            ></div>
          </motion.div>
        )}

        {view.type === "place-detail" && view.data && (
          <motion.div
            key="place-detail"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <PlaceDetailView 
              place={view.data} 
              onBack={handleBack}
              onAddToTrip={handleAddPlaceToTrip}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}