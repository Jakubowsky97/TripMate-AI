"use strict";
//File: server/src/controllers/preferencesController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreferences = void 0;
const supabase_1 = __importDefault(require("../utils/supabase"));
const updateUserPreferences = async (userId, newPrefs) => {
    const { data: existing, error } = await supabase_1.default
        .from("user_travel_preferences")
        .select("*")
        .eq("id", userId)
        .single();
    if (error && error.code !== "PGRST116") {
        console.error("Błąd przy sprawdzaniu preferencji:", error);
        return;
    }
    const mergedPrefs = {};
    const keys = [
        "travel_interests",
        "travel_style",
        "preferred_transport",
        "preferred_accommodation",
        "favorite_types_of_attractions",
        "trip_types",
    ];
    for (const key of keys) {
        const current = existing?.[key] ?? [];
        const incoming = newPrefs?.[key] ?? [];
        mergedPrefs[key] = Array.from(new Set([...current, ...incoming]));
    }
    const { error: upsertError } = await supabase_1.default
        .from("user_travel_preferences")
        .upsert({ id: userId, ...mergedPrefs });
    if (upsertError) {
        console.error("Błąd zapisu preferencji:", upsertError);
    }
};
exports.updateUserPreferences = updateUserPreferences;
