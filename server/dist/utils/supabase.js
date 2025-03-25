"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../env");
if (!env_1.SUPABASE_URL || !env_1.SUPABASE_KEY) {
    throw new Error("Supabase URL and Key must be defined");
}
const supabase = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_KEY);
exports.default = supabase;
