"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import {
  Plus,
  Settings,
  LogOut,
  ExternalLink,
  Eye,
  Users,
  TrendingUp,
  BarChart3,
  Mail,
  Bell,
  Edit,
  FileText,
  UserCircle,
  Pencil,
  Menu,
  X,
  Save,
  Trash2,
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

const SettingsView = ({ user, supabase }: { user: any; supabase: SupabaseClient }) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handlePasswordUpdate = async () => {
    setError(null)
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.")
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password updated successfully!")
      setTimeout(() => {
        supabase.auth.signOut()
        router.push("/auth/login?message=Password updated. Please log in again.")
      }, 2000)
    }
  }

  const isPasswordInvalid = newPassword.length > 0 && newPassword.length < 6

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-transparent"
                aria-invalid={isPasswordInvalid}
                aria-describedby="password-error"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-transparent"
                aria-invalid={newPassword !== confirmPassword && confirmPassword.length > 0}
                aria-describedby="password-match-error"
              />
            </div>
            <div id="password-error" aria-live="polite">
              {isPasswordInvalid && (
                <p className="text-sm text-red-500">Password must be at least 6 characters.</p>
              )}
            </div>
            <div id="password-match-error" aria-live="polite">
              {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                <p className="text-sm text-red-500">Passwords do not match.</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500" aria-live="assertive">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}
            <Button onClick={handlePasswordUpdate} disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 6}>
              {isSubmitting ? <span className="mr-2"><LoadingSpinner /></span> : <Save className="h-4 w-4 mr-2" />}
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
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
  const [activeNav, setActiveNav] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadDashboard() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id, full_name, job_title, company, created_at")
        .eq("id", user.id)
        .single()

      setProfile(profileData)
      
      if (profileData) {
        const { count: totalViewsCount } = await supabase.from("card_views").select("*", { count: "exact", head: true }).eq("card_owner_id", user.id)

        const today = new Date().toISOString().split("T")[0]
        const { count: todayViewsCount } = await supabase
          .from("card_views")
          .select("*", { count: "exact", head: true })
          .eq("card_owner_id", user.id)
          .gte("created_at", today)

        const { count: connectionsCount } = await supabase.from("connections").select("*", { count: "exact", head: true }).eq("user_id", user.id)

        setAnalytics({
          totalViews: totalViewsCount || 0,
          viewsToday: todayViewsCount || 0,
          totalConnections: connectionsCount || 0,
          cardsCreated: profileData ? 1 : 0,
        })
      }

      setLoading(false)
    }

    loadDashboard()

    const channel = supabase
      .channel("dashboard-analytics")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "card_views" },
        (payload) => {
          if (payload.new.card_owner_id === user?.id) {
            setAnalytics((prev) => ({
              ...prev,
              totalViews: prev.totalViews + 1,
              viewsToday: prev.viewsToday + 1,
            }))
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "connections" },
        (payload) => {
          if (payload.new.user_id === user?.id) {
            setAnalytics((prev) => ({
              ...prev,
              totalConnections: prev.totalConnections + 1,
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // We only want this effect to run once on mount, user object is stable after first check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard" />
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex min-h-screen bg-background">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
           <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/images/smart-africa_logo.png" alt="SA" className="w-20 h-20 rounded-full object-contain" />
</div>
            <div>
              <h2 className="font-bold text-foreground">Smart Africa</h2>
              <p className="text-xs text-muted-foreground">Digital Cards</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
            <Link href="/profile/create" onClick={() => setMobileMenuOpen(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Card
            </Link>
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <button
            onClick={() => {
              setActiveNav("dashboard")
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeNav === "dashboard"
                ? "bg-purple-50 text-purple-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <Link
            href="/profile/edit"
            onClick={() => {
              setActiveNav("editor")
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeNav === "editor"
                ? "bg-purple-50 text-purple-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Edit className="h-5 w-5" />
            <span className="font-medium">Editor</span>
          </Link>

          <Link
            href="/search"
            onClick={() => {
              setActiveNav("leads")
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeNav === "leads"
                ? "bg-purple-50 text-purple-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Connections</span>
          </Link>

          <button
            onClick={() => {
              setActiveNav("settings")
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeNav === "settings"
                ? "bg-purple-50 text-purple-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>

          <Link
            href={profile ? `/card/${profile.user_id}` : "#"}
            target="_blank"
            onClick={() => {
              setActiveNav("preview")
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeNav === "preview"
                ? "bg-purple-50 text-purple-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">Preview</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-border">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                  <span className="text-purple-700 font-semibold text-xs sm:text-sm">
                    {profile?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-sm hidden md:block">
                  <p className="font-semibold text-foreground">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeNav === "dashboard" && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-purple-900">
                      Hi, {profile?.full_name?.split(" ")[0] || "there"}
                    </h2>
                    <p className="text-purple-700 text-sm sm:text-base lg:text-lg">
                      Ready to manage your digital business cards?
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src="/images/front.png"
                      alt="Welcome illustration"
                      className="h-32 lg:h-48 w-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-3 sm:mb-4">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-0 text-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold">{analytics.cardsCreated}</p>
                        <p className="text-xs sm:text-sm opacity-90 mt-1">Cards Created</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              

               
              </div>
            </div>

            <div className="space-y-4">
              {profile ? (
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                          <UserCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-purple-700 truncate">
                            {profile.full_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {profile.job_title && profile.company
                              ? `${profile.job_title} at ${profile.company}`
                              : profile.job_title || profile.company || "Digital Business Card"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0">
                          Active
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Link href="/profile/edit">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/card/${profile.user_id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
                  <CardContent className="p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                      <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Create Your First Card</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Get started by creating your professional digital business card
                      </p>
                    </div>
                    <Link href="/profile/create">
                      <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Card
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeNav === "settings" && (
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>
            <SettingsView user={user} supabase={createClient()} />
          </div>
        )}
      </main>
    </div>
  )
}
