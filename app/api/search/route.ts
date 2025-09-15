import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, job_title, company, bio")
      .eq("user_id", userId.toUpperCase())
      .single()

    if (error || !profile) {
      return NextResponse.json({
        found: false,
        message: `No digital business card found with ID: ${userId.toUpperCase()}`,
      })
    }

    return NextResponse.json({
      found: true,
      profile: {
        user_id: profile.user_id,
        full_name: profile.full_name,
        job_title: profile.job_title,
        company: profile.company,
        bio: profile.bio,
      },
      message: `Found card for ${profile.full_name}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        found: false,
        message: "An error occurred while searching",
      },
      { status: 500 },
    )
  }
}
