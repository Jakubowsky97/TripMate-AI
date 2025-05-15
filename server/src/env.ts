import * as dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";

const envPath = path.resolve(__dirname, "../.env");

if (existsSync(envPath)) {
  console.log("✅ Loading local .env file");
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error("Failed to load .env file:", result.error);
  } else {
    console.log(".env loaded successfully");
  }
} else {
  console.log(" No .env file found, relying on environment variables (Railway/production)");
}

// Export values from env (with fallback for PORT)
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const PORT = process.env.PORT || 5001;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
