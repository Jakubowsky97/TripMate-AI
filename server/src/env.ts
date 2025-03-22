import * as dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env"); // Adjust the path if needed
console.log("Loading .env file from:", envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Failed to load .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const PORT = process.env.PORT || 5001;
export const HF_TOKEN = process.env.HF_TOKEN;
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;