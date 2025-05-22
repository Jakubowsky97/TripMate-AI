import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './utils/supabase/client';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const publicRoutes = [
    "/", "/auth/login", "/auth/register",
    "/auth/reset-password/verify-email",
    "/auth/register/step-1", "/auth/register/step-2",
    "/auth/register/step-3", "/auth/register/step-4",
    "/api/auth/checkVerification", "/api/auth/savePreferences",
    "/auth/confirm", "/auth/reset-password/", "/api/auth/login", "/api/auth/loginGoogle",
    "/api/auth/checkVerification", "/admin-auth"
  ];

  const pathname = request.nextUrl.pathname;
  const user = response.headers.get("x-user");

if (user) {
  // Dekodowanie danych z URL
  const userDecoded = decodeURIComponent(user);

  // Parsowanie do obiektu JSON
  const userObject = JSON.parse(userDecoded);
  const last_sign_in_at = new Date(userObject.last_sign_in_at);
  const now = new Date();
  const maxAgeHours = 24;
  const isSessionExpired = (now.getTime() - last_sign_in_at.getTime()) > maxAgeHours * 60 * 60 * 1000;
  if (isSessionExpired) {
    const supabase = createClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

  // ✅ Zgoda na publiczne ścieżki
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // 🔐 Sprawdź czy użytkownik jest zalogowany
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

// 🔁 Działa na wszystkich trasach oprócz assetów
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
