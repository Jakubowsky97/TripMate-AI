"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
import { FaBuilding } from "react-icons/fa";

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
  category?: string;
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
  onRemovePlace: (place: Place) => void; // nowy props
}


export default function TripMap({
  tripId,
  mapRef,
  socket,
  selectedPlaces,
  onRemovePlace,
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

      // Setup place details service for getting additional information
      const placesService = new google.maps.places.PlacesService(map);

      async function getDirections() {
        try {
          // Extract the start place (first place in the first city)
          const startPlace = selectedPlaces[0]?.places.find(
            (place) => place.is_start_point
          );

          // Extract the end place (last place in the last city)
          const lastCity = selectedPlaces[selectedPlaces.length - 1];
          const endPlace = lastCity?.places[lastCity.places.length - 1];

          if (!startPlace || !endPlace) {
            console.warn("Missing start or end points");
            return;
          }

          // Collect waypoints from intermediate places
          const waypoints = selectedPlaces.flatMap((cityObj) =>
            cityObj.places
              .filter((place) => !place.is_start_point && !place.is_end_point) // Exclude start and end points
              .map((place) => ({
                location: {
                  lat: place.coordinates[1],
                  lng: place.coordinates[0],
                },
                stopover: true, // Indicates that this is a stopover point
              }))
          );

          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
          });
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

      // Handle map clicks for adding new places
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Get place details from the location if possible
        const request = {
          location: { lat, lng },
          fields: [
            "name",
            "formatted_address",
            "place_id",
            "geometry",
            "types",
          ],
          types: ["establishment"],
          rankBy: google.maps.places.RankBy.DISTANCE,
        };

        placesService.nearbySearch(request, (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results.length > 0
          ) {
            // Process only the first place found
            const place = results[0];
            // Determine category from place types - expanded to include more place types
            let category = "place";
            if (place.types && place.types.length > 0) {
              // Priority list for categorization
              if (
                place.types.includes("restaurant") ||
                place.types.includes("food") ||
                place.types.includes("cafe") ||
                place.types.includes("bar")
              ) {
                category = "restaurant";
              } else if (
                place.types.includes("lodging") ||
                place.types.includes("hotel")
              ) {
                category = "hotel";
              } else if (
                place.types.includes("tourist_attraction") ||
                place.types.includes("museum") ||
                place.types.includes("park")
              ) {
                category = "attraction";
              } else if (
                place.types.includes("store") ||
                place.types.includes("shopping_mall")
              ) {
                category = "shopping";
              } else if (
                place.types.includes("transit_station") ||
                place.types.includes("bus_station") ||
                place.types.includes("train_station") ||
                place.types.includes("airport")
              ) {
                category = "transportation";
              } else if (
                place.types.includes("hospital") ||
                place.types.includes("pharmacy") ||
                place.types.includes("doctor")
              ) {
                category = "health";
              } else {
                // If none of the above categories match, use the first type as the category
                category =
                  place.types[0].charAt(0).toUpperCase() +
                  place.types[0].slice(1).replaceAll("_", " ");
              }
            }

            // Get more detailed place information
            placesService.getDetails(
              {
                placeId: place.place_id || "",
                fields: ["name", "formatted_address", "address_components"],
              },
              async (placeDetails, detailsStatus) => {
                if (
                  detailsStatus === google.maps.places.PlacesServiceStatus.OK &&
                  placeDetails
                ) {
                  // Extract city and country from address components
                  let city = "";
                  let country = "";

                  if (placeDetails.address_components) {
                    placeDetails.address_components.forEach((component) => {
                      if (component.types.includes("locality")) {
                        city = component.long_name;
                      }
                      if (component.types.includes("country")) {
                        country = component.long_name;
                      }
                    });
                  }

                  const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=17364394130fee8e7efd3f7ae2d533c5&units=metric`
                  );
                  const weather = weatherResponse.data;

                  const placeData = {
                    name: placeDetails.name || place.name || "Unnamed Place",
                    coordinates: [
                      place.geometry?.location?.lng() || lng,
                      place.geometry?.location?.lat() || lat,
                    ],
                    city,
                    country,
                    category,
                    weather: {
                      temp: `${weather.main.temp.toFixed(1)}°C`,
                      condition:
                        weather.weather[0].description.charAt(0).toUpperCase() +
                        weather.weather[0].description.slice(1),
                    }, 
                    type: category,
                    date: new Date().toISOString().split("T")[0], // Today's date
                  };

                  // Call the handlePlaceClick method via the custom handlers object
                  if (
                    mapRef.current &&
                    (mapRef.current as any).customHandlers?.handlePlaceClick
                  ) {
                    (mapRef.current as any).customHandlers.handlePlaceClick(
                      placeData
                    );
                  }
                }
              }
            );
          } else {
            // No place found, use generic data
            const placeData = {
              name: "New Place",
              coordinates: [lng, lat],
              category: "place",
              type: "place",
              city: "",
              country: "",
              weather: { temp: "25°C", condition: "Sunny" }, // Example data
              date: new Date().toISOString().split("T")[0], // Today's date
            };

            // Call the handlePlaceClick method via the custom handlers object
            if (
              mapRef.current &&
              (mapRef.current as any).customHandlers?.handlePlaceClick
            ) {
              (mapRef.current as any).customHandlers.handlePlaceClick(
                placeData
              );
            }
          }
        });
      });
      socket.on(
        "existingMarkers",
        (markers: { lat: number; lng: number }[]) => {
          markers.forEach(({ lat, lng }) => {
            new google.maps.Marker({ position: { lat, lng }, map });
          });
        }
      );

      socket.on("newMarker", (marker: { lat: number; lng: number }) => {
        new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
        });
      });

      // Markery z selectedPlaces
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
      place.is_start_point == true
        ? "#f59e0b"
        : place.is_end_point == true
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

    const infoWindowContent = `
      <div id="info-window-${place.name.replace(/\s+/g, "-")}">
        <h3>${place.name}</h3>
        <p><strong>City:</strong> ${place.city}</p>
        <p><strong>Country:</strong> ${place.country}</p>
        <p><strong>Type:</strong> ${place.type}</p>
        <p><strong>Weather:</strong> ${place.weather.temp}, ${place.weather.condition}</p>
        <p><strong>Date:</strong> ${place.date}</p>
        <button style="margin-top: 8px; background-color: #ef4444; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;" id="remove-marker-btn-${place.name.replace(/\s+/g, "-")}">
          Usuń miejsce
        </button>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);

      if (mapRef.current) {
        const latLng = new google.maps.LatLng(
          place.coordinates[1],
          place.coordinates[0]
        );
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(16);

        if ((mapRef.current as any).customHandlers?.handlePlaceClick) {
          (mapRef.current as any).customHandlers.handlePlaceClick(place);
        }
      }
    });

    // Obsługa kliknięcia "Usuń miejsce"
    google.maps.event.addListener(infoWindow, "domready", () => {
      const btn = document.getElementById(
        `remove-marker-btn-${place.name.replace(/\s+/g, "-")}`
      );
      if (btn) {
        btn.onclick = () => {
          marker.setMap(null); // usuń z mapy
          onRemovePlace(place); // aktualizuj stan w komponencie nadrzędnym
          infoWindow.close();
        };
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
