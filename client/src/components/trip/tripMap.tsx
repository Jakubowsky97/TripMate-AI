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
          // Extract the start place (first place in the first city)
          const startPlace = selectedPlaces[0]?.places.find((place) => place.is_start_point);
      
          // Extract the end place (last place in the last city)
          const lastCity = selectedPlaces[selectedPlaces.length - 1];
          const endPlace = lastCity?.places[lastCity.places.length - 1];
      
          if (!startPlace || !endPlace) {
            console.warn("Missing start or end points");
            return;
          }
      
          // Collect waypoints from intermediate places
          const waypoints = selectedPlaces
            .flatMap((cityObj) =>
              cityObj.places
                .filter((place) => !place.is_start_point && !place.is_end_point) // Exclude start and end points
                .map((place) => ({
                  location: { lat: place.coordinates[1], lng: place.coordinates[0] },
                  stopover: true, // Indicates that this is a stopover point
                }))
            );
      
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
          directionsRenderer.setMap(map);
      
          const request: google.maps.DirectionsRequest = {
            origin: {
              lat: startPlace.coordinates[1],
              lng: startPlace.coordinates[0],
            },
            destination: {
              lat: endPlace.coordinates[1],
              lng: endPlace.coordinates[0],
            },
            waypoints: waypoints, // Add waypoints here
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

          const marker = new google.maps.Marker({
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

          // Create an InfoWindow for the marker
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${place.name}</h3>
                <p><strong>City:</strong> ${place.city}</p>
                <p><strong>Country:</strong> ${place.country}</p>
                <p><strong>Type:</strong> ${place.type}</p>
                <p><strong>Weather:</strong> ${place.weather.temp}°C, ${place.weather.condition}</p>
                <p><strong>Date:</strong> ${place.date}</p>
              </div>
            `,
          });

          // Add a click listener to the marker to show the InfoWindow
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
            if (mapRef.current && place.coordinates?.length === 2) {
              const latLng = new google.maps.LatLng(place.coordinates[1], place.coordinates[0])
              mapRef.current.panTo(latLng)
              mapRef.current.setZoom(16)
            }
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
