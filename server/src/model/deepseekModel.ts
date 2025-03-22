import OpenAI from "openai";
import {DEEPSEEK_API_KEY} from "../env"

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: DEEPSEEK_API_KEY
});

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface ChatCompletion {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function getChatResponse(messages: Message[]){
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat', 
      messages: messages,
    })as unknown as ChatCompletion;

 
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Com. error with openAi:', error);
    throw error;
  }
}
(async () => {
  const messages: Message[] = [
    { role: "system", content: "You are a travel planning specialist, give me concise and short answers to the questions I ask you." },
    { role: 'user', content: 'Show me top 3 restaurants around Wawel in crackow i need their name,street,what cusine they serve check it, e.g. Google Maps and other map providers at current state of year 2025 check your information in diffrent sources' }, 
  ];

  const response = await getChatResponse(messages);
  console.log('Model response:', response);
})();

