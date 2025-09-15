"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, Settings, LogOut, ExternalLink, Copy } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-blue-400/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
             
  <img 
    src="/images/smart-africa_logo.png" 
    alt="SA" 
    className="w-24 h-24 rounded-full object-contain"
  />



              
              <span className="text-xl font-bold text-gray-900">Smart Africa</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {data.user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
          </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your digital business card and profile</p>
          </div>

          {!profile ? (
            // First time user - create profile
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your Digital Business Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Welcome! Let's create your professional digital business card to get started.
                </p>
                <Link href="/profile/create">
                  <Button className="bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700">
                    Create My Card
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Existing user - show profile options
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Digital Business Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                      {profile.job_title && <p className="text-gray-600">{profile.job_title}</p>}
                      {profile.company && <p className="text-gray-500 text-sm">{profile.company}</p>}
                    </div>
                    <Badge variant="outline" className="font-mono">
                      ID: {profile.user_id}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/card/${profile.user_id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Card
                      </Button>
                    </Link>
                    <Link href="/profile/edit">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/card/${profile.user_id}`)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">Share your digital business card with others</p>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Your Card URL:</p>
                        <p className="text-sm font-mono break-all">
                          {typeof window !== "undefined" ? window.location.origin : ""}/card/{profile.user_id}
                        </p>
                      </div>
                      <Link href={`/card/${profile.user_id}`}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Search className="h-4 w-4 mr-2" />
                          Preview & Share
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">Update your information and settings</p>
                    <div className="space-y-2">
                      <Link href="/profile/edit">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                      <Link href="/search">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Search className="h-4 w-4 mr-2" />
                          Search Cards
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="text-sm text-gray-600">Cards Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Views Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Connections</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
