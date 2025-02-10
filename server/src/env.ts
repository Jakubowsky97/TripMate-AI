import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Export environment variables for use elsewhere
export const SUPABASE_URL = process.env.SUPABASE_URL || "https://jjgtakmeqaeguwsarenk.supabase.co";
export const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZ3Rha21lcWFlZ3V3c2FyZW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NDQ2NDIsImV4cCI6MjA1NDMyMDY0Mn0.cwtV8WDutlTYVkSn81Cz3Ptzi7Ayk_YcHJd3Rp49C0w";
export const PORT = process.env.PORT || 5001;
