// lib/supabase/serverClient.ts
import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

export const supabaseServer = (request: NextRequest, response: NextResponse) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
