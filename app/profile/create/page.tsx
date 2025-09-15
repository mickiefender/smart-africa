"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BusinessCard } from "@/components/business-card"
import { ArrowLeft, Plus, Trash2, Save, Upload, X } from "lucide-react"
import Link from "next/link"

interface SocialLink {
  platform: string
  url: string
  display_name: string
}

interface WebsiteLink {
  title: string
  url: string
  description: string
}

export default function CreateProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile form data
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
  })

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [coverImagePreview, setCoverImagePreview] = useState<string>("")

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImagePreview(result)
        setFormData((prev) => ({ ...prev, profile_image_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverImagePreview(result)
        setFormData((prev) => ({ ...prev, cover_image_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setProfileImageFile(null)
    setProfileImagePreview("")
    setFormData((prev) => ({ ...prev, profile_image_url: "" }))
  }

  const removeCoverImage = () => {
    setCoverImageFile(null)
    setCoverImagePreview("")
    setFormData((prev) => ({ ...prev, cover_image_url: "" }))
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

  const generateUserId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to create a profile")
      }

      let profileImageUrl = formData.profile_image_url
      let coverImageUrl = formData.cover_image_url

      if (profileImageFile) {
        const fileExt = profileImageFile.name.split(".").pop()
        const fileName = `${user.id}-profile-${Date.now()}.${fileExt}`

        const { data: profileUpload, error: profileUploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImageFile)

        if (profileUploadError) throw profileUploadError

        const { data: profileUrlData } = supabase.storage.from("profile-images").getPublicUrl(profileUpload.path)

        profileImageUrl = profileUrlData.publicUrl
      }

      if (coverImageFile) {
        const fileExt = coverImageFile.name.split(".").pop()
        const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`

        const { data: coverUpload, error: coverUploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, coverImageFile)

        if (coverUploadError) throw coverUploadError

        const { data: coverUrlData } = supabase.storage.from("profile-images").getPublicUrl(coverUpload.path)

        coverImageUrl = coverUrlData.publicUrl
      }

      // Generate unique user ID
      let userId = generateUserId()
      let isUnique = false
      let attempts = 0

      while (!isUnique && attempts < 10) {
        const { data: existing } = await supabase.from("profiles").select("user_id").eq("user_id", userId).single()
        if (!existing) {
          isUnique = true
        } else {
          userId = generateUserId()
          attempts++
        }
      }

      if (!isUnique) {
        throw new Error("Unable to generate unique user ID. Please try again.")
      }

      // Create profile with uploaded image URLs
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          user_id: userId,
          ...formData,
          profile_image_url: profileImageUrl,
          cover_image_url: coverImageUrl,
        })
        .select()
        .single()

      if (profileError) throw profileError

      // Add social links
      if (socialLinks.length > 0) {
        const validSocialLinks = socialLinks.filter((link) => link.platform && link.url)
        if (validSocialLinks.length > 0) {
          const { error: socialError } = await supabase.from("social_links").insert(
            validSocialLinks.map((link) => ({
              profile_id: profile.id,
              platform: link.platform,
              url: link.url,
              display_name: link.display_name || link.platform,
            })),
          )
          if (socialError) throw socialError
        }
      }

      // Add website links
      if (websiteLinks.length > 0) {
        const validWebsiteLinks = websiteLinks.filter((link) => link.title && link.url)
        if (validWebsiteLinks.length > 0) {
          const { error: websiteError } = await supabase.from("website_links").insert(
            validWebsiteLinks.map((link) => ({
              profile_id: profile.id,
              title: link.title,
              url: link.url,
              description: link.description,
            })),
          )
          if (websiteError) throw websiteError
        }
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Create preview profile object
  const previewProfile = {
    id: "preview",
    user_id: "PREVIEW",
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
    website: formData.website_url || "", // Add website property
    theme_color: "#f97316", // Add a default theme_color (orange-500)
  }

  const previewSocialLinks = socialLinks
    .filter((link) => link.platform && link.url)
    .map((link, index) => ({
      id: `preview-${index}`,
      platform: link.platform,
      url: link.url,
      display_name: link.display_name,
    }))

  const previewWebsiteLinks = websiteLinks
    .filter((link) => link.title && link.url)
    .map((link, index) => ({
      id: `preview-${index}`,
      title: link.title,
      url: link.url,
      description: link.description,
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Smart Africa</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Digital Business Card</h1>
            <p className="text-gray-600">Fill in your information to create your professional digital business card</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
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

                {/* Contact Information */}
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
                        placeholder="michael@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+(233) 208 517 482"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Takoradi, Ghana"
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

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="profile_image">Profile Image</Label>
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
                              onClick={removeProfileImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-full">
                            <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="mt-2">
                          <Input
                            id="profile_image"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cover_image">Cover Image</Label>
                      <div className="mt-2">
                        {coverImagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={coverImagePreview || "/placeholder.svg"}
                              alt="Cover preview"
                              className="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeCoverImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Upload cover image</p>
                            </div>
                          </div>
                        )}
                        <div className="mt-2">
                          <Input
                            id="cover_image"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
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

                {/* Website Links */}
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
                >
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create My Card
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Preview */}
            <div className="lg:sticky lg:top-24">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <p className="text-sm text-gray-600">See how your card will look</p>
              </div>
             
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
