"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    found: boolean
    profile?: any
    message: string
  } | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return

    setIsSearching(true)
    setSearchResult(null)

    try {
      const supabase = createClient()

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, job_title, company")
        .eq("user_id", userId.toUpperCase())
        .single()

      if (error || !profile) {
        setSearchResult({
          found: false,
          message: `No digital business card found with ID: ${userId.toUpperCase()}`,
        })
      } else {
        setSearchResult({
          found: true,
          profile,
          message: `Found card for ${profile.full_name}`,
        })

        // Redirect to the card after a short delay
        setTimeout(() => {
          router.push(`/card/${userId.toUpperCase()}`)
        }, 1500)
      }
    } catch (error) {
      setSearchResult({
        found: false,
        message: "An error occurred while searching. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Card</h1>
          <p className="text-gray-600">Enter your unique user ID to access your digital business card</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Search for Your Card</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your User ID (e.g., ABC12345)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono"
                  maxLength={8}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700"
                disabled={isSearching || !userId.trim()}
              >
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find My Card
                  </>
                )}
              </Button>
            </form>

            {searchResult && (
              <div className="mt-4">
                <Alert className={searchResult.found ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {searchResult.found ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={searchResult.found ? "text-green-800" : "text-red-800"}>
                    {searchResult.message}
                    {searchResult.found && searchResult.profile && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">{searchResult.profile.full_name}</p>
                        {searchResult.profile.job_title && (
                          <p className="text-green-600">{searchResult.profile.job_title}</p>
                        )}
                        {searchResult.profile.company && (
                          <p className="text-green-600">{searchResult.profile.company}</p>
                        )}
                        <p className="mt-2 text-green-700">Redirecting to card...</p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Don't have a card yet?</p>
              <Link href="/auth/sign-up">
                <Button variant="outline" size="sm">
                  Create Your Card
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">Tips for finding your card:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• User IDs are 8 characters long (e.g., ABC12345)</li>
                <li>• Check your email for your User ID</li>
                <li>• User IDs are case-insensitive</li>
                <li>• Contact support if you've lost your ID</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
