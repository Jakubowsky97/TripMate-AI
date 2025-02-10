import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL and Key must be defined");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
export { supabase };
