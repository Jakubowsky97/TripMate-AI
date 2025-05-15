"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaBuilding,
  FaSun,
  FaTemperatureHigh,
  FaUtensils,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

interface PlaceDetailViewProps {
  place: {
    name: string;
    city?: string;
    country?: string;
    type?: string;
    coordinates: number[];
    weather?: { temp: string; condition: string };
    category?: string;
  };
  onBack: () => void;
  onAddToTrip: (placeData: any) => void;
}

export default function PlaceDetailView({
  place,
  onBack,
  onAddToTrip,
}: PlaceDetailViewProps) {
  const [tripPointType, setTripPointType] = useState<"Waypoint" | "Start" | "End">("Waypoint");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>(place.category || "");

  const getPlaceIcon = () => {
    if (selectedCategory === "restaurant" || place.type === "restaurant") {
      return <FaUtensils className="text-[#c2410c] mr-2" />;
    } else if (selectedCategory === "hotel" || place.type === "hotel" || selectedCategory === "lodging") {
      return <FaBuilding className="text-[#c2410c] mr-2" />;
    } else if (tripPointType === "Start") {
      return <FaPlaneDeparture className="text-[#b45309] mr-2" />;
    } else if (tripPointType === "End") {
      return <FaPlaneArrival className="text-[#be123c] mr-2" />;
    } else {
      return <FaMapMarkerAlt className="text-[#c2410c] mr-2" />;
    }
  };

  const getBackgroundColor = () => {
    if (tripPointType === "Start") return "bg-[#fffbeb]";
    if (tripPointType === "End") return "bg-[#fff1f2]";
    return "bg-[#fff7ed]";
  };

  const getTitleColor = () => {
    if (tripPointType === "Start") return "text-[#b45309]";
    if (tripPointType === "End") return "text-[#be123c]";
    return "text-[#c2410c]";
  };

  const formatDateRange = (start: string, end: string) => {
    const startObj = new Date(start);
    const endObj = new Date(end);

    const sameMonth = startObj.getMonth() === endObj.getMonth();
    const sameYear = startObj.getFullYear() === endObj.getFullYear();

    const options = { month: "long", day: "numeric" } as const;
    const startFormatted = startObj.toLocaleDateString("en-US", options);
    const endFormatted = endObj.toLocaleDateString("en-US", { day: "numeric" });

    if (sameMonth && sameYear) {
      return `${startFormatted}-${endFormatted}, ${startObj.getFullYear()}`;
    } else {
      return `${startObj.toLocaleDateString("en-US", options)} - ${endObj.toLocaleDateString("en-US", options)}, ${endObj.getFullYear()}`;
    }
  };

  const handleAddToTrip = () => {
    const date = selectedCategory === "hotel" ? formatDateRange(startDate, endDate) : startDate;

    const placeData = {
      ...place,
      type: selectedCategory || place.type,
      date,
      category: selectedCategory,
      is_start_point: tripPointType === "Start",
      is_end_point: tripPointType === "End",
      weather: place.weather || { temp: "N/A", condition: "Unknown" },
    };

    onAddToTrip(placeData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Place Details</h2>
        <FaArrowLeft
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          size={20}
          onClick={onBack}
        />
      </div>

      <div className={`p-5 rounded-2xl shadow-md ${getBackgroundColor()}`}>
        <div className="flex items-center mb-4">
          {getPlaceIcon()}
          <h3 className={`font-semibold text-xl ${getTitleColor()}`}>
            {place.name}
          </h3>
        </div>

        {(place.city || place.country) && (
          <p className="text-gray-600 mb-2">
            {place.city}
            {place.city && place.country ? ", " : ""}
            {place.country}
          </p>
        )}

        {place.weather && (
          <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
            <div className="flex items-center gap-1">
              <FaTemperatureHigh />
              <span>{place.weather.temp}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaSun />
              <span>{place.weather.condition}</span>
            </div>
          </div>
        )}

        <div className="mb-4">
  <label className="block text-sm font-medium mb-1 text-gray-700">
    Category
  </label>
  <select
    className="w-full border border-gray-300 rounded-md p-2"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">Select a category</option>
    {[
      "restaurant",
      "hotel",
      "landmark",
      "museum",
      "shopping",
      "nature",
    ].map((cat) => (
      <option key={cat} value={cat}>
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </option>
    ))}

    {place.type &&
      ![
        "restaurant",
        "hotel",
        "landmark",
        "museum",
        "shopping",
        "nature",
      ].includes(place.type) && (
        <option value={place.type}>
          {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
        </option>
      )}
  </select>
</div>


        {selectedCategory === "hotel" ? (
          <div className="flex flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-3">
          <p className="font-medium text-gray-800">Add to trip as:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={tripPointType === "Waypoint" ? "solid" : "outline"}
              onClick={() => setTripPointType("Waypoint")}
              className="flex items-center gap-1"
            >
              <FaMapMarkerAlt /> Stopover
            </Button>
            <Button
              variant={tripPointType === "Start" ? "solid" : "outline"}
              onClick={() => setTripPointType("Start")}
              className="flex items-center gap-1"
            >
              <FaPlaneDeparture /> Start
            </Button>
            <Button
              variant={tripPointType === "End" ? "solid" : "outline"}
              onClick={() => setTripPointType("End")}
              className="flex items-center gap-1"
            >
              <FaPlaneArrival /> End
            </Button>
          </div>
        </div>

        <Button
          onClick={handleAddToTrip}
          className="w-full mt-6 flex items-center justify-center gap-2"
        >
          <FaPlus /> Add to Trip
        </Button>
      </div>
    </div>
  );
}
