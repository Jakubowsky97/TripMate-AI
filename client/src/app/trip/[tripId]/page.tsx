'use client';

import dynamic from 'next/dynamic';
import TripMap from '@/components/trip/tripMap';
import { useParams, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import io from 'socket.io-client';
import SidebarLeft from '@/components/trip/sideBarLeft';
import SidebarRight from '@/components/trip/sideBarRight';

const socket = io('http://localhost:5000');

// Lazy load TripHeader to prevent SSR issues
const TripHeader = dynamic(() => import('@/components/trip/tripHeader'), { ssr: false });

export default function TripPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = Array.isArray(params?.tripId) ? params.tripId[0] : params?.tripId;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userId = searchParams.get('user_id');

  const [activeUsers, setActiveUsers] = useState(['Alice', 'Bob']);
  const [inactiveUsers, setInactiveUsers] = useState(['Charlie', 'David']);
  const [selectedPlaces, setSelectedPlaces] = useState([
    { name: 'Best Pizza', type: 'Restaurant', coordinates: [52.52, 13.405] },
    { name: 'Grand Hotel', type: 'Hotel', coordinates: [48.8566, 2.3522] },
  ]); 
  
  if (!tripId) return <p>Ładowanie...</p>;

  return (
    <div className="flex flex-col h-screen">
      <TripHeader mapRef={mapRef} tripId={tripId} socket={socket} activeUsers={activeUsers} inactiveUsers={inactiveUsers} userId={userId || ''} />
      <div className="flex flex-grow">
        <SidebarLeft selectedPlaces={selectedPlaces} />
        <div className="flex-grow">
          <TripMap tripId={tripId} mapRef={mapRef} socket={socket} />
        </div>
        <SidebarRight />
      </div>
    </div>
  );
}
