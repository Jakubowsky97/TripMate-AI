import { ChatDeepSeek } from "@langchain/deepseek";
import { Request, Response } from "express";

const chatModel = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, 
  model: "deepseek-chat",
});

export const chatController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const systemPrompt = `
      You are an AI travel assistant. 
      Your job is to help users create and suggest trips based on their previous travels and preferences. 
      If the user has not provided preferences yet, try to gather the following details:
      - Travel interests
      - Travel style
      - Preferred transport
      - Preferred accommodation
      - Favorite types of attractions
      
      Respond in a friendly and proactive way, making the user feel like they are talking to a helpful travel expert.
    `;

    const response = await chatModel.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]);

    res.json({ message: response.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
