import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST(req: Request) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 400 })
  }

  const response = NextResponse.json({ message: 'Token saved in cookie' })

  response.headers.set('Set-Cookie', serialize('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 dzień
  }))

  return response
}
