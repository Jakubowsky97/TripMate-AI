'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY204NmM2YjJkMDM2eDJqcXUxNGZrMHptYyJ9.2yh44mpmkTOS404uv3bxYg';

export default function TripMap({ tripId, mapRef, socket }: { tripId: string, mapRef: React.MutableRefObject<mapboxgl.Map | null>, socket: any }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [19.94498, 50.06465], // Kraków
      zoom: 10,
    });

    mapRef.current = map;

    map.on('load', () => {
      if (tripId) {
        socket.emit('joinTrip', tripId);
      }
    });

    // Odbieranie istniejących markerów (gdy użytkownik dołącza)
    socket.on('existingMarkers', (markers: { lng: number; lat: number; }[]) => {
      markers.forEach(({ lng, lat }: { lng: number; lat: number }) => {
        new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      });
    });

    // Odbieranie nowych markerów (dodanych przez innych użytkowników)
    socket.on('newMarker', (marker: { lng: number; lat: number }) => {
      new mapboxgl.Marker().setLngLat([marker.lng, marker.lat]).addTo(map);
    });

    // Dodawanie nowego markera na kliknięcie mapy
    map.on('click', (event) => {
      if (!event.lngLat) return;
      const { lng, lat } = event.lngLat;

      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      if (tripId) socket.emit('addMarker', { tripId, marker: { lng, lat } });
    });

    return () => {
      socket.off('existingMarkers');
      socket.off('newMarker');
      map.remove();
    };
  }, [tripId]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
}
