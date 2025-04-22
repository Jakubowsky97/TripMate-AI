import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Sprawdzenie czy sesja jest przeterminowana
  if (user && isSessionExpired(user)) {
    await supabase.auth.signOut()

    supabaseResponse.cookies.delete('access_token')

    return supabaseResponse
  }

  if (user) {
    try {
      const safeUserData = JSON.stringify(user)
      supabaseResponse.headers.set("x-user", encodeURIComponent(safeUserData))
    } catch (error) {
      console.error('Error encoding user data for header:', error)
    }
  }

  return supabaseResponse
}

const isSessionExpired = (user: any) => {
  if (!user) return true
  const lastSignIn = new Date(user.last_sign_in_at)
  const now = new Date()
  const maxAgeHours = 48 // 2 dni
  return (now.getTime() - lastSignIn.getTime()) > maxAgeHours * 60 * 60 * 1000
}
