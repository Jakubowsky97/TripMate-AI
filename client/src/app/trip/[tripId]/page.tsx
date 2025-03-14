'use client';

import TripMap from '@/components/trip/tripMap';
import { useParams } from 'next/navigation';

export default function TripPage() {
  const params = useParams();
  const tripId = Array.isArray(params?.tripId) ? params.tripId[0] : params?.tripId;

  if (!tripId) return <p>Ładowanie...</p>;

  return (
    <div>
      <h1>Podróż: {tripId}</h1>
      
      <TripMap tripId={tripId}/>
    </div>
  );
}
