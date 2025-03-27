import { ChatDeepSeek } from "@langchain/deepseek";

const chatModel = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, 
  model: "deepseek-chat",
});

export const processChatMessage = async (message: string) => {
  const response = await chatModel.invoke(message);
  return response;
};