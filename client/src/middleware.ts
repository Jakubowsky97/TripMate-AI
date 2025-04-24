import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

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

  // ✅ Zgoda na publiczne ścieżki
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // 🔐 Sprawdź czy użytkownik jest zalogowany
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 🔒 Sprawdź czy użytkownik ma dostęp admina (ciasteczko `adminAccess`)
  const adminAccess = request.cookies.get("adminAccess")?.value;

  if (!adminAccess || adminAccess !== "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-auth";
    return NextResponse.redirect(url);
  }

  return response;
}

// 🔁 Działa na wszystkich trasach oprócz assetów
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
