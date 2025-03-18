import { SearchBox } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import { useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY204NmM2YjJkMDM2eDJqcXUxNGZrMHptYyJ9.2yh44mpmkTOS404uv3bxYg';

export default function TripHeader({ mapRef, tripId, socket }: { mapRef: React.MutableRefObject<mapboxgl.Map | null>, tripId: string, socket: any }) {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = (result: any) => {
        if (!mapRef.current) {
            console.error("Mapa nie jest jeszcze załadowana.");
            return;
        }

        const { coordinates } = result.features[0].geometry;
        const [lng, lat] = coordinates;

        mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });

        const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);

        if (tripId) {
            socket.emit('addMarker', { tripId, marker: { lng, lat } });
        }
    };

    return (
        <div className="flex flex-row justify-between items-center p-4 px-12 bg-yellow-300">
            <h1 className="text-xl font-bold">TripMate</h1>
            {mapRef.current && (
                <SearchBox
                    accessToken={mapboxgl.accessToken || ''}
                    map={mapRef.current}
                    mapboxgl={mapboxgl}
                    value={inputValue}
                    onChange={(d) => setInputValue(d)}
                    onRetrieve={handleSearch}
                    marker
                />
            )}
        </div>
    );
}
