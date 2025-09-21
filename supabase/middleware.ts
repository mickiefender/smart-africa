// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { supabaseServer } from "@/lib/supabase/serverClient"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = supabaseServer(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Define public routes
  const PUBLIC_PATHS = [
    "/",
    "/auth",
    "/login",
    "/api/payment/initialize",
    "/api/payment/verify",
  ]
  const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // Redirect to login if route is protected and user is not logged in
  if (!isPublic && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
