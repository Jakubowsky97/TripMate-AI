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

export default function TripHeader({ mapRef, tripId, socket, activeUsers, inactiveUsers, userId }: { mapRef: React.MutableRefObject<mapboxgl.Map | null>, tripId: string, socket: any, activeUsers: any[], inactiveUsers: any[], userId: string }) {
    const [inputValue, setInputValue] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    const [userData, setUserData] = useState<UserData | null>(null);
    const [localData, setLocalData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        avatarUrl: "",
      });



          useEffect(() => {
            const fetchUserData = async () => {
              if (!userId) {
                setError("Missing or invalid user_id");
                setLoading(false);
                return;
              }
              try {
                const response = await fetch(`http://localhost:5000/api/profile/getUser?user_id=${userId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to fetch user data");
        
                const user = data.data[0] || null;
                setUserData(user);
                if (user) {
                  const [firstName, lastName] = user.full_name.split(" ");
                  setLocalData({
                    firstName: firstName || "",
                    lastName: lastName || "",
                    username: user.username || "",
                    email: user.email || "",
                    avatarUrl: user.avatar_url || "",
                  });
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
              } finally {
                setLoading(false);
              }
              
            };
        
            fetchUserData();
          }, [searchParams]);

          useEffect(() => {
            if (localData.avatarUrl) {
              downloadImage(localData.avatarUrl);
            }
          }, [localData.avatarUrl])
        
          async function downloadImage(path: string) {
            try {
              const { data, error } = await supabase.storage.from('avatars').download(path)
              if (error) {
                throw error;
              }
              const url = URL.createObjectURL(data)
              setAvatarUrl(url)
            } catch (error) {
              if (error instanceof Error) {
                console.log('Error downloading image: ', error.message)
              } else {
                console.log('Error downloading image: ', error)
              }
            }
          }

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

    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

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
              <UserAvatars users={activeUsers} />

                <IoMdNotifications size={24} />

                <Image
                    src={avatarUrl || '/default.png'}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="avatar rounded-full w-12 h-12"
                />
            </div>
          </div>
        </nav>
      );
}
