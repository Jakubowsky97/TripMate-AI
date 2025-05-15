import * as dotenv from "dotenv";
import path from "path";

if(process.env.NODE_ENV != "production") {
  const envPath = path.resolve(__dirname, "../.env");
  console.log("Loading .env file from:", envPath);

  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error("Failed to load .env file:", result.error);
  } else {
    console.log(".env file loaded successfully");
  }
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const PORT = process.env.PORT || 5001;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;