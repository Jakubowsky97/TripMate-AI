import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Dozwolone trasy bez logowania
  const publicRoutes = [
    "/", "/auth/login", "/auth/register",
    "/auth/reset-password/verify-email",
    "/auth/register/step-1", "/auth/register/step-2",
    "/auth/register/step-3", "/auth/register/step-4",
    "/api/auth/checkVerification", "/api/auth/savePreferences",
    "/auth/confirm", "/auth/reset-password/", "/api/auth/login", "api/auth/loginGoogle",
    "/api/auth/checkVerification"
  ]

  // Pobieramy sesję użytkownika
  const user = response.headers.get("x-user") // Możesz zwrócić usera w updateSession, np. w nagłówku

  if (!user && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (request.nextUrl.pathname.startsWith('/auth/register')) {
    return NextResponse.rewrite(new URL('/auth/register/step-1', request.url))
  }

  return response
}

// Definiujemy, gdzie middleware działa
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',],
}
