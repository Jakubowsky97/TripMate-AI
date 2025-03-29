import { ChatDeepSeek } from "@langchain/deepseek";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const chatModel = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
});

// Tworzenie pamięci rozmowy
const memory = new BufferMemory({
  returnMessages: true, // Zapewnia dostęp do poprzednich wiadomości
  memoryKey: "history", 
});

// Tworzenie konwersacji
const conversation = new ConversationChain({
  llm: chatModel,
  memory,
});

export const processChatMessage = async (message: string) => {
  const response = await conversation.call({ input: message });

  return response.response; 
};
