import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import supabase from "../utils/supabase";
import { EmailOtpType } from "@supabase/supabase-js";

const JWT_SECRET = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const generateToken = (payload: object, expiresIn: string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
};

export const confirmEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token_hash, type, next, user_id } = req.query;

    if (!user_id) return res.status(400).json({ error: "Unable to get user" });
    if (!token_hash || !type) return res.status(400).json({ error: "Missing token_hash or type" });

    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    });

    if (error) return res.status(400).json({ error: error.message });

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ isConfirmed: true })
      .eq("id", user_id);

    if (updateError) {
      console.error("Error updating email confirmation status:", updateError);
      return res.status(500).json({ message: "Failed to update confirmation status" });
    }

    return res.status(200).json({ message: "Email confirmed successfully", success: true, next: next || "/" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkEmailVerification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id } = req.query;
    const { data, error } = await supabase
      .from("profiles")
      .select("isConfirmed")
      .eq("id", user_id);

    if (error) {
      console.error("Error fetching email confirmation status:", error);
      return res.status(500).json({ message: "Failed to fetch confirmation status" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ isConfirmed: data[0].isConfirmed });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const saveUserPreferences = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({ error: "Missing user ID or preferences" });
    }

    const { data, error } = await supabase
      .from("user_travel_preferences")
      .upsert(
        [
          {
            id: userId,
            travel_interests: preferences.travel_interests || [],
            travel_style: preferences.travel_style || [],
            preferred_transport: preferences.preferred_transport || [],
            preferred_accommodation: preferences.preferred_accommodation || [],
            favorite_types_of_attractions: preferences.favorite_types_of_attractions || [],
          },
        ],
        { onConflict: "id" }
      );

    if (error) {
      console.error("Supabase Error: ", error);
      return res.status(500).json({ error: error.message || "Failed to save preferences" });
    }

    return res.status(200).json({ message: "Preferences saved successfully", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });

  const user = data.user;

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const accessToken = generateToken({ id: user.id }, ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = generateToken({ id: user.id }, REFRESH_TOKEN_EXPIRES_IN);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,  // Only secure cookies in production
    maxAge: 15 * 60 * 1000,
  });
  
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,  // Only secure cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Login successful", user });
};

export const loginWithGoogle = async (req: Request, res: Response): Promise<Response> => {
  const { response } = req.body;
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
    });

    if (signInError) {
      return res.status(500).json({ error: "Error signing in with Google", details: signInError });
    }

    return res.status(200).json({ message: "Login successful", user: signInData?.user });
  } catch (error) {
    return res.status(500).json({ error: "Error signing in with Google", details: error });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.refresh_token;

  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const newAccessToken = generateToken({ id: decoded.id }, ACCESS_TOKEN_EXPIRES_IN);

    console.log("New access token:", newAccessToken);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.status(200).json({ message: "Logged out" });
};

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
