'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';  
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from '@mapbox/search-js-react';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY204NmM2YjJkMDM2eDJqcXUxNGZrMHptYyJ9.2yh44mpmkTOS404uv3bxYg';
const socket = io('http://localhost:5000');

export default function TripMap({ tripId }: { tripId: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [inputValue, setInputValue] = useState("");

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
      setIsMapLoaded(true);
      if (tripId) {
        socket.emit('joinTrip', tripId);
      }
    });

    socket.on('existingMarkers', (markers) => {
      markers.forEach((marker: { lng: number, lat: number }) => {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .addTo(mapRef.current!);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      });
    });

    socket.on('newMarker', (data) => {
      if (data && typeof data.lng === 'number' && typeof data.lat === 'number') {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([data.lng, data.lat])
          .addTo(mapRef.current!);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      }
    });

    map.on('click', (event) => {
      if (!event.lngLat) {
        console.error('Event lngLat is null');
        return;
      }
      const { lng, lat } = event.lngLat;
      if (mapRef.current) {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        if (tripId) {
          socket.emit('addMarker', { tripId, marker: { lng, lat } });
        }

        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      }
    });

    return () => {
      map.remove();
    };
  }, [tripId]);

  return (
    <div>
            {isMapLoaded && (
        <SearchBox
          accessToken={mapboxgl.accessToken || ''}
          map={mapRef.current || undefined}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(d) => setInputValue(d)}
          onRetrieve={(result) => {
            const { coordinates } = result.features[0].geometry;
            const [lng, lat] = coordinates;

            if (mapRef.current) {
              const newMarker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(mapRef.current);

              if (tripId) {
                socket.emit('addMarker', { tripId, marker: { lng, lat } });
              }

              setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
            }
          }}
          marker
        />
      )}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}
