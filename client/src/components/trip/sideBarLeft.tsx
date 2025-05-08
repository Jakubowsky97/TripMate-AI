"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TripTimeLine from "../ui/TripTimeLine";
import PlaceDetailView from "../ui/PlaceDetailView";

interface SidebarLeftProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  selectedPlaces: any[]; // Type to customize
  setSelectedPlaces: React.Dispatch<React.SetStateAction<any[]>>; // Type to customize
}

interface ViewState {
  type: "timeline" | "search" | "place-detail";
  data?: any; // Will hold place details when in place-detail view
}

export default function SidebarLeft({ 
  mapRef, 
  selectedPlaces,
  setSelectedPlaces 
}: SidebarLeftProps) {
  const [view, setView] = useState<ViewState>({ type: "timeline" });

  const handleBack = () => {
    setView({ type: "timeline" });
  };

  // Call this when a place on the map is clicked
  const handlePlaceClick = (placeData: any) => {
    setView({ 
      type: "place-detail", 
      data: placeData 
    });
  };

  // Handle adding a place to the trip
  const handleAddPlaceToTrip = (placeData: any) => {
    // Find if the city already exists in selectedPlaces
    const cityIndex = selectedPlaces.findIndex(
      cityObj => cityObj.city === placeData.city
    );

    if (cityIndex !== -1) {
      // City exists, add place to its places array
      const updatedSelectedPlaces = [...selectedPlaces];
      updatedSelectedPlaces[cityIndex].places.push(placeData);
      setSelectedPlaces(updatedSelectedPlaces);
    } else {
      // Create new city entry
      const newCityEntry = {
        city: placeData.city || "Unknown City",
        country: placeData.country || "Unknown Country",
        places: [placeData]
      };
      setSelectedPlaces([...selectedPlaces, newCityEntry]);
    }

    // Return to timeline view
    setView({ type: "timeline" });
  };

  // Expose the handlePlaceClick method via a custom property
  // Using a proper type extension
  if (mapRef.current) {
    (mapRef.current as any).customHandlers = {
      ...(mapRef.current as any).customHandlers,
      handlePlaceClick
    };
  }

  return (
    <div className="w-1/5 xl:w-[30%] 2xl:w-1/5 p-4 overflow-y-auto h-screen pt-24 scrollbar-hide">
      <AnimatePresence mode="wait">
        {view.type === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <TripTimeLine selectedPlaces={selectedPlaces} mapRef={mapRef} />
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
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
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