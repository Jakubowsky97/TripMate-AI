'use client';

import dynamic from 'next/dynamic';
import TripMap from '@/components/trip/tripMap';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Lazy load TripHeader to prevent SSR issues
const TripHeader = dynamic(() => import('@/components/trip/tripHeader'), { ssr: false });

export default function TripPage() {
  const params = useParams();
  const tripId = Array.isArray(params?.tripId) ? params.tripId[0] : params?.tripId;
  const mapRef = useRef<mapboxgl.Map | null>(null);

  if (!tripId) return <p>Ładowanie...</p>;

  return (
    <div>
      <TripHeader mapRef={mapRef} tripId={tripId} socket={socket} />
      <TripMap tripId={tripId} mapRef={mapRef} socket={socket} />
    </div>
  );
}
