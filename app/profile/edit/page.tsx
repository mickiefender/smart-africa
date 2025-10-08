"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BusinessCard } from "@/components/business-card"
import { Plus, Trash2, Save, Loader2, Upload, X } from "lucide-react"

interface SocialLink {
  id?: string
  platform: string
  url: string
  display_name: string
}

interface WebsiteLink {
  id?: string
  title: string
  url: string
  description: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string>("")
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [coverImagePreview, setCoverImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    phone: "",
    email: "",
    website_url: "",
    location: "",
    company: "",
    job_title: "",
    profile_image_url: "",
    cover_image_url: "",
    user_id: "",
  })

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>([])

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        if (profileError.code === "PGRST116") {
          router.push("/profile/create")
          return
        }
        throw profileError
      }

      setProfileId(profile.id)
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        email: profile.email || "",
        website_url: profile.website_url || "",
        location: profile.location || "",
        company: profile.company || "",
        job_title: profile.job_title || "",
        profile_image_url: profile.profile_image_url || "",
        cover_image_url: profile.cover_image_url || "",
        user_id: profile.user_id || "",
      })

      if (profile.profile_image_url) {
        setProfileImagePreview(profile.profile_image_url)
      }
      if (profile.cover_image_url) {
        setCoverImagePreview(profile.cover_image_url)
      }

      const { data: socialData } = await supabase
        .from("social_links")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: true })

      if (socialData) {
        setSocialLinks(
          socialData.map((link) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
            display_name: link.display_name || link.platform,
          })),
        )
      }

      const { data: websiteData } = await supabase
        .from("website_links")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: true })

      if (websiteData) {
        setWebsiteLinks(
          websiteData.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            description: link.description || "",
          })),
        )
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to load profile")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: "", url: "", display_name: "" }])
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    setSocialLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const addWebsiteLink = () => {
    setWebsiteLinks((prev) => [...prev, { title: "", url: "", description: "" }])
  }

  const updateWebsiteLink = (index: number, field: string, value: string) => {
    setWebsiteLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  const removeWebsiteLink = (index: number) => {
    setWebsiteLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = (file: File, type: "profile" | "cover") => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "profile") {
          setProfileImageFile(file)
          setProfileImagePreview(result)
          handleInputChange("profile_image_url", result)
        } else {
          setCoverImageFile(file)
          setCoverImagePreview(result)
          handleInputChange("cover_image_url", result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type: "profile" | "cover") => {
    if (type === "profile") {
      setProfileImageFile(null)
      setProfileImagePreview("")
      handleInputChange("profile_image_url", "")
    } else {
      setCoverImageFile(null)
      setCoverImagePreview("")
      handleInputChange("cover_image_url", "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          phone: formData.phone,
          email: formData.email,
          website_url: formData.website_url,
          location: formData.location,
          company: formData.company,
          job_title: formData.job_title,
          profile_image_url: formData.profile_image_url,
          cover_image_url: formData.cover_image_url,
        })
        .eq("id", profileId)

      if (profileError) throw profileError

      await supabase.from("social_links").delete().eq("profile_id", profileId)

      const validSocialLinks = socialLinks.filter((link) => link.platform && link.url)
      if (validSocialLinks.length > 0) {
        const { error: socialError } = await supabase.from("social_links").insert(
          validSocialLinks.map((link) => ({
            profile_id: profileId,
            platform: link.platform,
            url: link.url,
            display_name: link.display_name || link.platform,
          })),
        )
        if (socialError) throw socialError
      }

      await supabase.from("website_links").delete().eq("profile_id", profileId)

      const validWebsiteLinks = websiteLinks.filter((link) => link.title && link.url)
      if (validWebsiteLinks.length > 0) {
        const { error: websiteError } = await supabase.from("website_links").insert(
          validWebsiteLinks.map((link) => ({
            profile_id: profileId,
            title: link.title,
            url: link.url,
            description: link.description,
          })),
        )
        if (websiteError) throw websiteError
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const previewProfile = {
    id: profileId,
    user_id: formData.user_id,
    full_name: formData.full_name || "Your Name",
    bio: formData.bio,
    profile_image_url: formData.profile_image_url,
    cover_image_url: formData.cover_image_url,
    phone: formData.phone,
    email: formData.email,
    website_url: formData.website_url,
    location: formData.location,
    company: formData.company,
    job_title: formData.job_title,
    website: formData.website_url || "",
    theme_color: "#FFA500",
  }

  const previewSocialLinks = socialLinks
    .filter((link) => link.platform && link.url)
    .map((link, index) => ({
      id: link.id || `preview-${index}`,
      platform: link.platform,
      url: link.url,
      username: link.display_name || "",
    }))

  const previewWebsiteLinks = websiteLinks
    .filter((link) => link.title && link.url)
    .map((link, index) => ({
      id: link.id || `preview-${index}`,
      title: link.title,
      url: link.url,
      description: link.description,
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Digital Business Card</h1>
            <p className="text-gray-600">
              Update your information and customize your professional digital business card
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="job_title">Job Title</Label>
                      <Input
                        id="job_title"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange("job_title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Smart Africa Tech"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell people about yourself..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Lagos, Nigeria"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website_url">Website</Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => handleInputChange("website_url", e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Profile Image</Label>
                      <div className="mt-2">
                        {profileImagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={profileImagePreview || "/placeholder.svg"}
                              alt="Profile preview"
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage("profile")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, "profile")
                            }}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <Label
                            htmlFor="profile-image-upload"
                            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Profile Image
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Cover Image</Label>
                      <div className="mt-2">
                        {coverImagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={coverImagePreview || "/placeholder.svg"}
                              alt="Cover preview"
                              className="w-48 h-24 rounded-lg object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage("cover")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-48 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, "cover")
                            }}
                            className="hidden"
                            id="cover-image-upload"
                          />
                          <Label
                            htmlFor="cover-image-upload"
                            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Cover Image
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Social Links
                      <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {socialLinks.map((link, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label>Platform</Label>
                          <Input
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                            placeholder="instagram"
                          />
                        </div>
                        <div className="flex-1">
                          <Label>URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Display Name</Label>
                          <Input
                            value={link.display_name}
                            onChange={(e) => updateSocialLink(index, "display_name", e.target.value)}
                            placeholder="@username"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSocialLink(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Website Links
                      <Button type="button" variant="outline" size="sm" onClick={addWebsiteLink}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {websiteLinks.map((link, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label>Title</Label>
                            <Input
                              value={link.title}
                              onChange={(e) => updateWebsiteLink(index, "title", e.target.value)}
                              placeholder="My Portfolio"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>URL</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => updateWebsiteLink(index, "url", e.target.value)}
                              placeholder="https://myportfolio.com"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeWebsiteLink(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={link.description}
                            onChange={(e) => updateWebsiteLink(index, "description", e.target.value)}
                            placeholder="Check out my latest work"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700"
                  disabled={isLoading}
                  onClick={async (e) => {
                    await handleSubmit(e)
                    if (!error) {
                      window.close() // Close the tab after saving
                    }
                  }}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Close
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <p className="text-sm text-gray-600">See how your card will look</p>
              </div>
              <BusinessCard
                profile={previewProfile}
                socialLinks={previewSocialLinks}
                websiteLinks={previewWebsiteLinks}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
