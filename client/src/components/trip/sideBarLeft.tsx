"use client";

// SidebarLeft.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TripTimeLine from "../ui/TripTimeLine";

interface SidebarLeftProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  selectedPlaces: any[]; // Typ danych do dostosowania
  setSelectedPlaces: React.Dispatch<React.SetStateAction<any[]>>; // Typ danych do dostosowania
}

export default function SidebarLeft({ mapRef, selectedPlaces }: SidebarLeftProps) {
  const [view, setView] = useState<"timeline" | "search">("timeline");

  const handleSearch = async () => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    if (!center) return;

    const lib = (await google.maps.importLibrary("places")) as any;
    const PlaceListElement = lib.PlaceListElement;

    // Create and mount the PlaceList
    const listEl = new PlaceListElement({
      locationRestriction: { center: center.toJSON(), radius: 2000 },
      includedTypes: [], // fetch all types if empty
      maxResultCount: 20,
    });

    const container = document.getElementById("place-list-container")!;
    container.innerHTML = "";
    container.appendChild(listEl);
    setView("search");
  };

  const handleBack = () => setView("timeline");

  return (
    <div className="w-1/5 xl:w-[30%] 2xl:w-1/5 p-4 overflow-y-auto h-screen pt-24 scrollbar-hide">
      <AnimatePresence mode="wait">
        {view === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Zakładamy, że TripTimeLine jest renderowane w TripPage */}
            <Button className="w-full" onClick={handleSearch}>
              Wyszukaj miejsca
            </Button>
            <TripTimeLine selectedPlaces={selectedPlaces} mapRef={mapRef} />
          </motion.div>
        )}

        {view === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Wyniki wyszukiwania</h2>
              <Button variant="ghost" onClick={handleBack}>
                ← Wróć
              </Button>
            </div>
            <div
              id="place-list-container"
              className="space-y-2 max-h-[75vh] overflow-y-auto pr-1"
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
