'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';  
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY204NmM2YjJkMDM2eDJqcXUxNGZrMHptYyJ9.2yh44mpmkTOS404uv3bxYg';
const socket = io('http://localhost:5000');

export default function TripMap({ tripId }: { tripId: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [19.94498, 50.06465], // Kraków
      zoom: 10,
    });

    map.on('load', () => {
      mapRef.current = map;
      setIsMapLoaded(true); // Map is fully loaded now
    });

    // Dołącz do pokoju z tripId
    if (tripId) {
      socket.emit('joinTrip', tripId); // Wysyłamy tripId do serwera, aby dołączyć do pokoju
    }

    // Reagowanie na nowy znacznik z serwera
    socket.on('newMarker', (data) => {
        if (data && typeof data.lng === 'number' && typeof data.lat === 'number') { // Check that data contains valid lng and lat
        const newMarker = new mapboxgl.Marker()
          .setLngLat([data.lng, data.lat])
          .addTo(mapRef.current!);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      }
    });

    // Nasłuchiwanie kliknięcia na mapie
    map.on('click', (event) => {
      if (!event.lngLat) {
        console.error('Event lngLat is null');
        return;
      }
        
      const { lng, lat } = event.lngLat;

      // Only add marker if map is ready
      if (mapRef.current) {
        console.log("lng: " + lng + " lat: " + lat);    
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        // Wysyłanie informacji o nowym znaczniku do serwera
        if (tripId) {
            socket.emit('addMarker', { tripId, marker: { lng, lat } }); // Send the marker as an object
        }

        // Dodanie lokalnego stanu dla markerów
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      }
    });

    return () => {
      map.remove();
    };
  }, [tripId]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
}
