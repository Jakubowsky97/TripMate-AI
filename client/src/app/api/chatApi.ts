import axios from "axios";

export const sendMessageToServer = async (message: string, tripId: string, userId:string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat/sendMessage`,
      { message, tripId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return { message: "Server error. Please try again later." };
  }
};

export const fetchChatHistory = async (userId: string, tripId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history?tripId=${tripId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Nie udało się pobrać historii czatu");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
