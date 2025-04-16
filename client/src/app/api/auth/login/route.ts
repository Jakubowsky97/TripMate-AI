import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: () => {}, // Nie ustawiamy tu cookies — zrobimy to ręcznie niżej
      },
    }
  );

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
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dzień
  });

  return {response, user: data.user}; // Zwracamy odpowiedź z danymi użytkownika
}
