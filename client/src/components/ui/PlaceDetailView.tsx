'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  FaBuilding, 
  FaSun, 
  FaTemperatureHigh, 
  FaUtensils, 
  FaMapMarkerAlt, 
  FaPlaneDeparture, 
  FaPlaneArrival,
  FaPlus
} from 'react-icons/fa';

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

export default function PlaceDetailView({ place, onBack, onAddToTrip }: PlaceDetailViewProps) {
  const [tripPointType, setTripPointType] = useState<'Waypoint' | 'Start' | 'End'>('Waypoint');
  
  // Get icon based on category or type
  const getPlaceIcon = () => {
    if (place.category === 'restaurant' || place.type === 'restaurant') {
      return <FaUtensils className="text-[#c2410c] mr-2" />;
    } else if (place.category === 'hotel' || place.type === 'hotel' || place.category === 'lodging') {
      return <FaBuilding className="text-[#c2410c] mr-2" />;
    } else if (tripPointType === 'Start') {
      return <FaPlaneDeparture className="text-[#b45309] mr-2" />;
    } else if (tripPointType === 'End') {
      return <FaPlaneArrival className="text-[#be123c] mr-2" />;
    } else {
      return <FaMapMarkerAlt className="text-[#c2410c] mr-2" />;
    }
  };

  const getBackgroundColor = () => {
    if (tripPointType === 'Start') return 'bg-[#fffbeb]';
    if (tripPointType === 'End') return 'bg-[#fff1f2]';
    return 'bg-[#fff7ed]';
  };

  const getTitleColor = () => {
    if (tripPointType === 'Start') return 'text-[#b45309]';
    if (tripPointType === 'End') return 'text-[#be123c]';
    return 'text-[#c2410c]';
  };

  const handleAddToTrip = () => {
    const placeData = {
      ...place,
      type: tripPointType,
      date: new Date().toISOString().split('T')[0],
      is_start_point: tripPointType === 'Start',
      is_end_point: tripPointType === 'End',
      weather: place.weather || { temp: 'N/A', condition: 'Unknown' }
    };
    
    onAddToTrip(placeData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Place Details</h2>
        <Button variant="ghost" onClick={onBack}>
          ← Back to Timeline
        </Button>
      </div>

      <div className={`p-4 rounded-lg ${getBackgroundColor()}`}>
        <div className="flex items-center mb-4">
          {getPlaceIcon()}
          <h3 className={`font-bold text-lg ${getTitleColor()}`}>{place.name}</h3>
        </div>

        {(place.city || place.country) && (
          <div className="mb-4">
            <p className="text-gray-700">
              {place.city && place.city}{place.city && place.country ? ', ' : ''}{place.country && place.country}
            </p>
          </div>
        )}

        {place.weather && (
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <FaTemperatureHigh />
              <span>{place.weather.temp || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaSun />
              <span>{place.weather.condition || 'Unknown'}</span>
            </div>
          </div>
        )}

        {place.category && (
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Category:</strong> {place.category}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <p className="font-medium">Add to trip as:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={tripPointType === 'Waypoint' ? 'solid' : 'outline'}
              onClick={() => setTripPointType('Waypoint')}
              className="flex items-center gap-1"
            >
              <FaMapMarkerAlt /> Waypoint
            </Button>
            <Button 
              variant={tripPointType === 'Start' ? 'solid' : 'outline'}
              onClick={() => setTripPointType('Start')}
              className="flex items-center gap-1"
            >
              <FaPlaneDeparture /> Starting Point
            </Button>
            <Button 
              variant={tripPointType === 'End' ? 'solid' : 'outline'}
              onClick={() => setTripPointType('End')}
              className="flex items-center gap-1"
            >
              <FaPlaneArrival /> End Point
            </Button>
          </div>
          
          <Button 
            onClick={handleAddToTrip}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add to Trip
          </Button>
        </div>
      </div>
    </div>
  );
}