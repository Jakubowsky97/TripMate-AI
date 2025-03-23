import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const supabase = createClient();

export const fetchTrips = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getAllTrips/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }
  const data = await response.json();

  if (data && data.data) {
    const mappedTrips = await Promise.all(
      data.data.map(async (item: any) => {
        let imageUrl = null;
        const imagePath = item.travel_data.image
          ? `${userId}/${item.travel_data.image}`
          : null;

        if (imagePath) {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("trip-images/user-images")
              .createSignedUrl(imagePath, 60);

          if (signedUrlError) {
            console.error("Error getting signed URL:", signedUrlError);
          } else {
            imageUrl = signedUrlData.signedUrl;
          }
        }

        // Pobieramy dane właściciela
        const owner = await fetchOwnerData(userId);

        // Użyj pustej tablicy, jeśli friends_list jest undefined
        const friendsData = await fetchFriendsData(item.friends_list || []);

        return {
          id: item.travel_data.id,
          title: item.travel_data.title,
          typeOfTrip: item.travel_data.type_of_trip || "No type specified",
          startDate: item.travel_data.start_date,
          endDate: item.travel_data.end_date,
          image: imageUrl || "/img/default.jpg",
          friendsList: friendsData,
          owner, // Dodajemy dane o właścicielu
        };
      })
    );
    return mappedTrips;
  }
};

const fetchOwnerData = async (ownerId: string) => {
  if (!ownerId) return "Unknown Owner"; // Jeśli brak właściciela, zwróć 'Unknown Owner'

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile/getUser?user_id=${ownerId}`
  );

  if (!response.ok) {
    console.error("Failed to fetch owner data");
    return "Unknown Owner";
  }

  const data = await response.json();
  return data.data[0]; 
};

export const fetchTripsFromFriends = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getTripsFromFriends/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trips from friends");
  }
  const data = await response.json();
  if (data && data.data) {
    const mappedTrips = await Promise.all(
      data.data.map(async (item: any) => {
        let imageUrl = null;
        const imagePath = item.image
          ? `${item.profiles_travel_data[0].profiles.id}/${item.image}`
          : null;
        if (imagePath) {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("trip-images/user-images")
              .createSignedUrl(imagePath, 60);

          if (signedUrlError) {
            console.error("Error getting signed URL:", signedUrlError);
          } else {
            imageUrl = signedUrlData.signedUrl;
          }
        }

        // Pobieramy dane właściciela
        const owner = await fetchOwnerData(item.profiles_travel_data[0].profiles.id);

        // Użyj pustej tablicy, jeśli friends_list jest undefined
        const friendsData = await fetchFriendsData(item.friends_list || []);

        return {
          id: item.id,
          title: item.title,
          typeOfTrip: item.type_of_trip || "No type specified",
          startDate: item.start_date,
          endDate: item.end_date,
          image: imageUrl || "/img/default.jpg",
          friendsList: friendsData,
          owner, // Dodajemy dane o właścicielu
        };
      })
    );

    console.log(mappedTrips);
    return mappedTrips;
  }
};


export const fetchFriendsData = async (friendsList: string[]) => {
  if (!Array.isArray(friendsList) || friendsList.length === 0) return [];

  const friendsQuery = friendsList.join(",");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile/getFriendsData?friends_list=${friendsQuery}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch friends data");
  }

  const data = await response.json();
  return data.data || [];
};
