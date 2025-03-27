import axios from 'axios';

export const sendMessageToServer = async (message: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    return { message: 'Server error. Please try again later.' };
  }
};
