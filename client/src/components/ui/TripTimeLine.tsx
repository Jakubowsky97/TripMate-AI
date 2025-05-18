"use client";

import { useEffect, useState } from "react";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import {
  FaBuilding,
  FaSun,
  FaTemperatureHigh,
  FaUtensils,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
} from "react-icons/fa";

interface Place {
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
}

interface SelectedPlaces {
  city: string;
  country: string;
  places: Place[];
}

interface TripTimeLineInterface {
  selectedPlaces: SelectedPlaces[];
  mapRef: React.MutableRefObject<any>;
  tripId: string;
}

const DraggableItem = ({ index, place, mapRef, isLast }: any) => {
  const {
    setNodeRef: setDraggableRef,
    attributes,
    listeners,
  } = useDraggable({
    id: `place-${index}`,
    data: { index },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${index}`,
    data: { index },
  });

  const typeColors = {
    Start: {
      bg: "bg-yellow-400",
      lightBg: "bg-yellow-50",
      iconText: "text-yellow-800",
      labelText: "text-yellow-700",
    },
    End: {
      bg: "bg-rose-500",
      lightBg: "bg-rose-50",
      iconText: "text-rose-800",
      labelText: "text-rose-700",
    },
    Default: {
      bg: "bg-orange-400",
      lightBg: "bg-orange-50",
      iconText: "text-orange-800",
      labelText: "text-orange-700",
    },
  };

  const typeStyle =
    place.is_start_point == true
      ? typeColors.Start
      : place.is_end_point == true
      ? typeColors.End
      : typeColors.Default;

  const icon =
    place.is_start_point == true ? (
      <FaPlaneDeparture className="text-white" />
    ) : place.is_end_point == true ? (
      <FaPlaneArrival className="text-white" />
    ) : (
      <FaMapMarkerAlt className="text-white" />
    );

  return (
    <div
      ref={setDroppableRef}
      className="relative flex flex-col sm:flex-row items-start gap-4 mb-8"
    >
      {/* Marker Icon */}
      <div
        ref={setDraggableRef}
        className={`relative z-10 flex items-center justify-center w-10 h-10 ${typeStyle.bg} rounded-full shadow-md`}
        {...attributes}
        {...listeners}
      >
        {icon}
      </div>

      {/* Vertical Line */}
      <div
        className={`absolute top-10 left-4 w-[2px] bg-neutral-200 ${
          isLast ? "h-0" : "h-full"
        }`}
      ></div>

      {/* Card */}
      <div
        ref={setDraggableRef}
        {...attributes}
        {...listeners}
        className={`w-full p-4 rounded-2xl shadow-md transition-all hover:shadow-lg cursor-pointer ${typeStyle.lightBg}`}
        onClick={() => {
          if (mapRef.current && place.coordinates?.length === 2) {
            const latLng = new google.maps.LatLng(
              place.coordinates[1],
              place.coordinates[0]
            );
            mapRef.current.panTo(latLng);
            mapRef.current.setZoom(16);
          }
        }}
      >
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-2">
          <h3
            className={`text-base sm:text-lg font-semibold ${typeStyle.iconText}`}
          >
            {place.name}
          </h3>
          <span
            className={`text-sm sm:text-base font-medium ${typeStyle.labelText}`}
          >
            {place.is_start_point == true
              ? "Start"
              : place.is_end_point == true
              ? "End"
              : "Stopover"}
          </span>
        </div>

        {/* Location and Date */}
        <p className="text-sm text-gray-500">
          {place.city}, {place.country}
        </p>
        <p className="text-sm text-gray-600 mb-3">{place.date}</p>

        {/* Details */}
        {place.is_start_point == true || place.is_end_point == true ? (
          <div
            className={`flex flex-wrap items-center gap-4 text-sm ${typeStyle.labelText}`}
          >
            <div className="flex items-center gap-1">
              <FaBuilding />
              <span>{place.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaTemperatureHigh />
              <span>{place.weather?.temp || "N/A"}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-orange-200 rounded-full text-sm text-orange-700">
              <FaBuilding />
              <span>{place.type}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-orange-200 rounded-full text-sm text-orange-700">
              <FaUtensils />
              <span>Restauracja</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TripTimeLine = ({ selectedPlaces, mapRef, tripId }: TripTimeLineInterface) => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    // Flatten all places from all cities into a single array
    const allPlaces = selectedPlaces.flatMap((cityObj) =>
      cityObj.places.map((place) => ({
        ...place,
        city: place.city || cityObj.city,
        country: place.country || cityObj.country,
      }))
    );
    setPlaces(allPlaces);
  }, [selectedPlaces]);

  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (!over) return;

    const reordered = [...places];
    const activeIndex = active.data.current.index;
    const overIndex = over.data.current.index;

    const [moved] = reordered.splice(activeIndex, 1);
    reordered.splice(overIndex, 0, moved);

    setPlaces(reordered);

    // Unflatten the places to update the selectedPlaces state
    const cities = reordered.reduce((acc: any, place: Place) => {
      const cityIndex = acc.findIndex(
        (city: any) => city.city === place.city
      );
      if (cityIndex === -1) {
        acc.push({
          city: place.city,
          country: place.country,
          places: [place],
        });
      } else {
        acc[cityIndex].places.push(place);
      }
      return acc;
    }
    , []);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/updateTrip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      places_to_stay: cities,
    }),
    credentials: "include",
  })
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative">
        <h2 className="text-xl font-semibold mb-4">Trip Timeline</h2>
        {places.length > 0 ? (
          places.map((place, index) => (
            <DraggableItem
              key={index}
              index={index}
              place={place}
              mapRef={mapRef}
              isLast={index === places.length - 1}
            />
          ))
        ) : (
          <p className="text-gray-500">No places selected</p>
        )}
      </div>
    </DndContext>
  );
};

export default TripTimeLine;
