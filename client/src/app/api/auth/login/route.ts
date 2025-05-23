import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const isProduction = process.env.NODE_ENV === "production";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "Unauthorized" }, { status: 401 });
  }

  const accessToken = data.session.access_token;

  // 🔐 Ustawiamy token jako ciasteczko
  const response = NextResponse.json({ access_token: accessToken });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dzień
    domain: isProduction ? ".tripmate-ai.com" : undefined
  });

  response.headers.set("X-user-id", data.user.id); 
  return response;
}
