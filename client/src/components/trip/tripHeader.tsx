import { createClient } from '@/utils/supabase/client';
import { SearchBox } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdNotifications } from "react-icons/io";
import UserAvatars from '../ui/UserAvatars';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JuMHgiLCJhIjoiY204NmM2YjJkMDM2eDJqcXUxNGZrMHptYyJ9.2yh44mpmkTOS404uv3bxYg';

interface UserData {
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}
 
export default function TripHeader({ mapRef, tripId, socket, localData, allUsers }: { mapRef: React.MutableRefObject<mapboxgl.Map | null>, tripId: string, socket: any, localData: UserData, allUsers: any[] }) {
    const [inputValue, setInputValue] = useState("");
    const [showUserList, setShowUserList] = useState(false);

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
        <nav className="flex items-center justify-between bg-white shadow-md p-4 px-16 border">
            <div className='flex flex-row gap-9'>
                <div className="text-3xl font-bold text-orange-500">TripMate</div>
                {mapRef.current && (
                    <SearchBox
                        accessToken={mapboxgl.accessToken || ''}
                        map={mapRef.current}
                        mapboxgl={mapboxgl}
                        value={inputValue}
                        onChange={(d) => setInputValue(d)}
                        onRetrieve={handleSearch}
                        marker
                        placeholder='Search for a place...'
                        theme={{cssText: '.Input {width: 350px;} ' }}
                    />
                )}
            </div>
          
          <div>
            <div className='flex flex-row gap-8 items-center'>
              <UserAvatars users={allUsers} size={10}/>

                <IoMdNotifications size={24} />

                <Image
                    src={localData.avatar_url || '/img/default.png'}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="avatar rounded-full w-10 h-10"
                />
            </div>
          </div>
        </nav>
      );
}
