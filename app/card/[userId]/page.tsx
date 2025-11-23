import { createClient } from "@/lib/supabase/server"
import { BusinessCard } from "@/components/business-card"
import { CardManagement } from "@/components/card-management"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationBlocker } from "@/components/navigation-blocker"

interface PageProps {
  params: { userId: string }
}

export default async function CardPage({ params }: PageProps) {
  const { userId } = params
  const supabase = createClient()

  // Check if current user is the owner
  const { data: user } = await supabase.auth.getUser()
  let isOwner = false

  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId.toUpperCase())
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Check if current user owns this card
  if (user.user && user.user.id === profile.user_id) {
    isOwner = true
  }

  // Fetch social links
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true })

  // Fetch website links
  const { data: websiteLinks } = await supabase
    .from("website_links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBlocker />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Business Card */}
            <div className="lg:col-span-2 flex justify-center">
              <BusinessCard profile={profile} socialLinks={socialLinks || []} websiteLinks={websiteLinks || []} />
            </div>

           </div>
        </div>
      </main>
    </div>
  )
}
