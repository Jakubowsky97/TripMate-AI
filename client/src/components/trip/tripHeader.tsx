"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { FaCompass, FaUserPlus } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import UserAvatars from "../ui/UserAvatars";

interface UserData {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
  email: string;
}

export default function TripHeader({
  mapRef,
  tripId,
  socket,
  localData,
  allUsers,
  onShareClick,
}: {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  tripId: string;
  socket: any;
  localData: UserData;
  allUsers: any[];
  onShareClick: () => void;
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Ustawienie Autocomplete po załadowaniu mapy
  useEffect(() => {
    if (mapRef.current && inputRef.current) {
      const autocompleteInstance = new google.maps.places.Autocomplete(
        inputRef.current
      );
      autocompleteInstance.setFields(["geometry", "name"]);
      setAutocomplete(autocompleteInstance);

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && mapRef.current) {
          const location = place.geometry.location;
          if (location) {
            mapRef.current.panTo(location);
          }
          mapRef.current.setZoom(14);

          new google.maps.Marker({
            position: location,
            map: mapRef.current,
          });

          if (tripId) {
            socket.emit("addMarker", {
              tripId,
              marker: location
                ? { lat: location.lat(), lng: location.lng() }
                : undefined,
            });
          }
        }
      });
    }
  }, [mapRef.current, inputRef.current]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-white shadow-md p-4 px-16 border">
      <div className="flex flex-row gap-9">
        <div
          className="flex flex-row items-center gap-2 hover:cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <FaCompass size={28} className="text-[#f97316]" />
          <h1 className="text-2xl font-bold text-[#1f2937]">TripMate AI</h1>
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a place..."
          className="border rounded-md px-4 py-2 w-[350px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      <div>
        <div className="flex flex-row gap-8 items-center">
          <FaUserPlus
            size={26}
            className="cursor-pointer hover:text-orange-500 transition"
            onClick={onShareClick}
          />

          <Image
            src={localData.avatar_url || "/img/default.png"}
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
