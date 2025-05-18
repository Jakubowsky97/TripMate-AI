import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Dodajemy userId jako argument funkcji
export const fetchTrips = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getAllTrips/`,
    {
      credentials: 'include', // Pamiętamy o ciasteczkach!
    }
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
          if (item.travel_data.image.includes("https://") || item.travel_data.image.includes("http://")) {
            imageUrl = item.travel_data.image; 
          } else {
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
        }

        // Pobieramy dane właściciela na podstawie userId
        const owner = await fetchOwnerData(userId);

        return {
          id: item.travel_data.id,
          title: item.travel_data.title,
          typeOfTrip: item.travel_data.type_of_trip || "No type specified",
          startDate: item.travel_data.start_date,
          endDate: item.travel_data.end_date,
          image: imageUrl || "/img/default.jpg",
          friendsList: item.travel_data.friends_list || [],
          status: item.travel_data.status,
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getUserData?user_id=${ownerId}`,
    {
      credentials: 'include', // Pamiętamy o ciasteczkach!
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch owner data");
    return "Unknown Owner";
  }

  const data = await response.json();
  return data.data[0];
};

export const fetchTripsFromFriends = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/trip/getTripsFromFriends`,
    {
      credentials: 'include', // Pamiętamy o ciasteczkach!
    }
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

        console.log("Owner data:", owner);

        return {
          id: item.id,
          title: item.title,
          typeOfTrip: item.type_of_trip || "No type specified",
          startDate: item.start_date,
          endDate: item.end_date,
          image: imageUrl || "/img/default.jpg",
          friendsList: item.friends_list || [],
          owner, // Dodajemy dane o właścicielu
        };
      })
    );
    return mappedTrips;
  }
};

export const fetchFriendsData = async (friendsList: string[]) => {
  if (!friendsList || friendsList.length === 0 || friendsList[0] === "") {
    console.error("Friends list is empty");
    return;
  }

  const friendsQuery = friendsList.join(",");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile/getFriendsData?friends_list=${friendsQuery}`,
    {
      credentials: 'include', // Pamiętamy o ciasteczkach!
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch friends data");
  }

  const data = await response.json();
  return data.data || [];
};
