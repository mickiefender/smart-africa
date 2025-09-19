"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import {
  Plus,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Copy,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Share2,
  BarChart3,
} from "lucide-react"

interface Profile {
  user_id: string
  full_name: string
  job_title?: string
  company?: string
  created_at: string
}

interface Analytics {
  totalViews: number
  viewsToday: number
  totalConnections: number
  cardsCreated: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 0,
    viewsToday: 0,
    totalConnections: 0,
    cardsCreated: 0,
  })
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setProfile(profileData)

      if (profileData) {
        // Get total views from card_views table (if it exists)
        const { data: viewsData } = await supabase.from("card_views").select("*").eq("card_owner_id", user.id)

        // Get today's views
        const today = new Date().toISOString().split("T")[0]
        const { data: todayViewsData } = await supabase
          .from("card_views")
          .select("*")
          .eq("card_owner_id", user.id)
          .gte("created_at", today)

        // Get connections count (if connections table exists)
        const { data: connectionsData } = await supabase.from("connections").select("*").eq("user_id", user.id)

        setAnalytics({
          totalViews: viewsData?.length || 0,
          viewsToday: todayViewsData?.length || 0,
          totalConnections: connectionsData?.length || 0,
          cardsCreated: profileData ? 1 : 0,
        })
      }

      setLoading(false)
    }

    loadDashboard()

    const interval = setInterval(loadDashboard, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [router])

  const handleCopyLink = async () => {
    if (profile) {
      await navigator.clipboard.writeText(`${window.location.origin}/card/${profile.user_id}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted/50">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/images/smart-africa_logo.png"
                alt="Smart Africa"
                className="w-12 h-12 rounded-full object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Smart Africa Cards</h1>
                <p className="text-sm text-muted-foreground">Digital Business Cards</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Welcome to Your Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage your digital presence and track your impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-chart-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cards Created</p>
                    <p className="text-3xl font-bold text-foreground">{analytics.cardsCreated}</p>
                  </div>
                  <div className="p-3 bg-chart-1/10 rounded-full">
                    <BarChart3 className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Views Today</p>
                    <p className="text-3xl font-bold text-foreground">{analytics.viewsToday}</p>
                  </div>
                  <div className="p-3 bg-chart-2/10 rounded-full">
                    <Eye className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-3">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-3xl font-bold text-foreground">{analytics.totalViews}</p>
                  </div>
                  <div className="p-3 bg-chart-3/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Connections</p>
                    <p className="text-3xl font-bold text-foreground">{analytics.totalConnections}</p>
                  </div>
                  <div className="p-3 bg-chart-4/10 rounded-full">
                    <Users className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {!profile ? (
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <Plus className="h-6 w-6 mr-2 text-primary" />
                  Create Your Digital Business Card
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground text-lg">
                  Welcome! Let's create your professional digital business card to get started.
                </p>
                <Link href="/profile/create">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Plus className="h-5 w-5 mr-2" />
                    Create My Card
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main card info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Your Digital Business Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-foreground">{profile.full_name}</h3>
                        {profile.job_title && <p className="text-muted-foreground font-medium">{profile.job_title}</p>}
                        {profile.company && <p className="text-sm text-muted-foreground">{profile.company}</p>}
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        ID: {profile.user_id.slice(0, 8)}...
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link href={`/card/${profile.user_id}`} target="_blank">
                        <Button variant="default" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Card
                        </Button>
                      </Link>
                      <Link href="/profile/edit" target="_blank">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className={copySuccess ? "bg-green-50 border-green-200" : ""}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copySuccess ? "Copied!" : "Copy Link"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick actions sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Share2 className="h-5 w-5 mr-2 text-secondary" />
                      Quick Share
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Your Card URL:</p>
                      <p className="text-sm font-mono break-all text-foreground">
                        {typeof window !== "undefined" ? window.location.origin : ""}/card/{profile.user_id}
                      </p>
                    </div>
                    <Link href={`/card/${profile.user_id}`} target="_blank">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Search className="h-4 w-4 mr-2" />
                        Preview & Share
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-accent" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/profile/edit" target="_blank">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Search className="h-4 w-4 mr-2" />
                        Search Cards
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
