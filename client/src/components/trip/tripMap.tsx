"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

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
  coordinates: number[];
  date: string;
}

interface CityPlaces {
  city: string;
  country: string;
  places: Place[];
}

interface TripMapProps {
  tripId: string;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
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
    if (selectedPlaces.length === 0) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "beta",
      libraries: ["places", "maps"],
    });

    loader.load().then(() => {
      const firstPlace = selectedPlaces[0]?.places[0];
      if (!firstPlace || firstPlace.coordinates.length !== 2) return;

      const map = new google.maps.Map(mapContainerRef.current!, {
        center: {
          lat: firstPlace.coordinates[1],
          lng: firstPlace.coordinates[0],
        },
        zoom: 10,
      });

      mapRef.current = map;

      async function getDirections() {
        try {
          const startPlace = selectedPlaces[0]?.places[0];
          const lastCity = selectedPlaces[selectedPlaces.length - 1];
          const endPlace = lastCity?.places[lastCity.places.length - 1];

          if (!startPlace || !endPlace) {
            console.warn("Brakuje punktów startowych lub końcowych");
            return;
          }

          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          const request = {
            origin: {
              lat: startPlace.coordinates[1],
              lng: startPlace.coordinates[0],
            },
            destination: {
              lat: endPlace.coordinates[1],
              lng: endPlace.coordinates[0],
            },
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error("Error with directions:", status);
            }
          });
        } catch (error) {
          console.error("Error getting directions:", error);
        }
      }

      getDirections();

      // Obsługa socketów
      socket.emit("joinTrip", tripId);

      socket.on("existingMarkers", (markers: { lat: number; lng: number }[]) => {
        markers.forEach(({ lat, lng }) => {
          new google.maps.Marker({ position: { lat, lng }, map });
        });
      });

      socket.on("newMarker", (marker: { lat: number; lng: number }) => {
        new google.maps.Marker({ position: { lat: marker.lat, lng: marker.lng }, map });
      });

      // Markery z selectedPlaces
      selectedPlaces.forEach((cityObj) => {
        cityObj.places.forEach((place) => {
          if (
            !place.coordinates ||
            place.coordinates.length !== 2 ||
            typeof place.coordinates[0] !== "number" ||
            typeof place.coordinates[1] !== "number"
          )
            return;

          const color =
            place.type === "Start"
              ? "#f59e0b"
              : place.type === "End"
              ? "#f43f5e"
              : "#f97316";

          new google.maps.Marker({
            position: { lat: place.coordinates[1], lng: place.coordinates[0] },
            map,
            title: place.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 1,
              scale: 8,
              strokeColor: "white",
              strokeWeight: 2,
            },
          });
        });
      });

      return () => {
        socket.off("existingMarkers");
        socket.off("newMarker");
        mapRef.current = null;
      };
    });
  }, [selectedPlaces, tripId, mapRef, socket]);

  return <div ref={mapContainerRef} className="h-[92vh] w-full" />;
}
