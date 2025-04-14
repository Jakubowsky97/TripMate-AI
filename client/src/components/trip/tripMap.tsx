'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

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
  coordinates: any[]; // ewentualnie [number, number]
  date: string;
}

interface CityPlaces {
  city: string;
  country: string;
  places: Place[];
}

interface TripMapProps {
  tripId: string;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  socket: any;
  selectedPlaces: CityPlaces[];
}

export default function TripMap({
  tripId,
  mapRef,
  socket,
  selectedPlaces,
}: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(selectedPlaces.length === 0) return;

    mapRef.current?.flyTo({
      center: selectedPlaces[0].places[0].coordinates as [number, number],
      zoom: 10,
      speed: 1.2,
    })

    async function getDirections() {
      try {
        const response = await axios.get("https://api.mapbox.com/directions/v5/mapbox/driving/" + selectedPlaces[0].places[0]?.coordinates[0] + "," + selectedPlaces[0].places[0].coordinates[1] + ";" + selectedPlaces[selectedPlaces.length - 1].places[selectedPlaces[selectedPlaces.length - 1].places.length - 1].coordinates[0] + "," + selectedPlaces[selectedPlaces.length - 1].places[selectedPlaces[selectedPlaces.length - 1].places.length - 1].coordinates[1] + "?geometries=geojson&access_token=" + process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
      
        const route = response.data.routes[0].geometry.coordinates;
        const routeGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
              properties: {},
            },
          ],
        };

        const map = mapRef.current;
        if (map) {
          map.addSource('route', {
            type: 'geojson',
            data: routeGeoJSON,
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#888',
              'line-width': 8,
            },
          });
        }
      } catch (error) {
        console.error("Error flying to coordinates:", error);
      }
    }

    getDirections();
  }, [mapRef]);

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
    socket.on('existingMarkers', (markers: { lng: number; lat: number }[]) => {
      markers.forEach(({ lng, lat }) => {
        new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      });
    });

    // Odbieranie nowych markerów (dodanych przez innych użytkowników)
    socket.on('newMarker', (marker: { lng: number; lat: number }) => {
      new mapboxgl.Marker().setLngLat([marker.lng, marker.lat]).addTo(map);
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      socket.off('existingMarkers');
      socket.off('newMarker');
      map.remove();
    };
  }, [tripId, mapRef, socket]);

  useEffect(() => {
    if (!mapRef.current || !selectedPlaces) return;
  
    // Iterujemy najpierw po miastach, a następnie po miejscach
    selectedPlaces.forEach((cityObj) => {
      cityObj.places.forEach((place) => {
        if (
          !place.coordinates ||
          place.coordinates.length !== 2 ||
          typeof place.coordinates[0] !== 'number' ||
          typeof place.coordinates[1] !== 'number'
        )
          return;
  
        const color =
          place.type === 'Start'
            ? '#f59e0b' // kolor startowy
            : place.type === 'End'
            ? '#f43f5e' // kolor końcowy
            : '#f97316'; // normalny
  
        new mapboxgl
          .Marker({ color })
          .setLngLat(place.coordinates as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3>${place.name}</h3>
              <p><strong>Type:</strong> ${place.type}</p>
              <p><strong>Date:</strong> ${place.date}</p>
              <p><strong>Weather:</strong> ${place.weather.temp}, ${place.weather.condition}</p>
            `)
          )
          .addTo(mapRef.current!);
      });
    });
    console.log(selectedPlaces);
  }, [selectedPlaces, mapRef]);

  
  return <div ref={mapContainerRef} className='h-[92vh]' />;
}
