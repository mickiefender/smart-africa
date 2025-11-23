"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TikTokIcon from "./icons/tiktok-icon"

import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Download,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  ExternalLink,
} from "lucide-react"

interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  company: string
  job_title: string
  bio: string
  location: string
  website: string
  profile_image_url?: string
  cover_image_url?: string
  theme_color: string
}

interface SocialLink {
  id: string
  platform: string
  url: string
  username: string
}

interface WebsiteLink {
  id: string
  title: string
  url: string
  description?: string
}

interface BusinessCardProps {
  profile: Profile
  socialLinks: SocialLink[]
  websiteLinks: WebsiteLink[]
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  tiktok: TikTokIcon,
  gmail: Mail,
}

const socialColors = {
  facebook: "bg-blue-600 hover:bg-blue-700",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  twitter: "bg-blue-400 hover:bg-blue-500",
  x: "bg-black hover:bg-gray-800",
  linkedin: "bg-blue-700 hover:bg-blue-800",
  youtube: "bg-red-600 hover:bg-red-700",
  whatsapp: "bg-green-500 hover:bg-green-600",
  tiktok: "bg-black hover:bg-gray-800",
  gmail: "bg-red-500 hover:bg-red-600",
}

const getWhatsAppUrl = (url: string): string => {
  // If it's already a full WhatsApp URL, return as is
  if (url.includes("wa.me") || url.includes("whatsapp.com")) {
    return url
  }

  // Extract phone number: keep digits and + prefix for international format
  const phoneNumber = url.replace(/[^\d+]/g, "")

  // Ensure phone number starts with + for international format
  const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`

  return `https://wa.me/${formattedPhone}`
}

export function BusinessCard({ profile, socialLinks, websiteLinks }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name}
ORG:${profile.company}
TITLE:${profile.job_title}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:${profile.website}
ADR:;;${profile.location};;;;
NOTE:${profile.bio}
END:VCARD`

    const blob = new Blob([vCardData], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${profile.full_name.replace(/\s+/g, "_")}_contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name} - Digital Business Card`,
          text: `Connect with ${profile.full_name} from ${profile.company}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      } catch (error) {
        console.log("Failed to copy link:", error)
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden shadow-2xl border-0 bg-white">
        {/* Cover Image */}
        <div
          className="h-32 sm:h-36 bg-gradient-to-r from-orange-500 to-teal-600 relative"
          style={{
            background: profile.cover_image_url
              ? `url(${profile.cover_image_url}) center/cover`
              : `linear-gradient(135deg, ${profile.theme_color || "#f97316"}, #0d9488)`,
          }}
        >
          {/* Profile Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile.profile_image_url && !imageError ? (
                <img
                  src={profile.profile_image_url || "/placeholder.svg"}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-16 pb-6 px-6">
          {/* Basic Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-balance">{profile.full_name}</h1>
            <p className="text-lg text-orange-600 font-medium mb-1">{profile.job_title}</p>
            <p className="text-gray-600 mb-3 font-medium">{profile.company}</p>
            {profile.bio && <p className="text-sm text-gray-700 leading-relaxed text-pretty">{profile.bio}</p>}
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-6">
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors p-2 -m-2 rounded-lg hover:bg-orange-50"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">{profile.phone}</span>
              </a>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors p-2 -m-2 rounded-lg hover:bg-orange-50"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium break-all">{profile.email}</span>
              </a>
            )}

            {profile.location && (
              <div className="flex items-center gap-3 text-gray-700 p-2 -m-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">{profile.location}</span>
              </div>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors p-2 -m-2 rounded-lg hover:bg-orange-50"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium break-all">{profile.website}</span>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </a>
            )}
          </div>

          {/* Social Media Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-teal-500 rounded-full"></div>
                Connect with me
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {socialLinks.map((social) => {
                  const platform = social.platform.toLowerCase()
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                  const colorClass = socialColors[platform as keyof typeof socialColors]

                  const displayUrl = platform === "whatsapp" ? getWhatsAppUrl(social.url) : social.url
                  const displayUsername =
                    platform === "whatsapp" && !social.url.includes("wa.me") ? social.url : social.username

                  if (!IconComponent) return null

                  return (
                    <a
                      key={social.id}
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${colorClass}`}
                      title={`Connect on ${social.platform}`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-xs font-semibold capitalize text-center leading-tight">
                        {platform === "x" ? "X" : platform}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Website Links */}
          {websiteLinks && websiteLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Links</h3>
              <div className="space-y-2">
                {websiteLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{link.title}</div>
                        {link.description && <div className="text-xs text-gray-600 mt-1">{link.description}</div>}
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleDownloadVCard}
              variant="outline"
              size="sm"
              className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Save Contact
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex-1 border-teal-200 text-teal-600 hover:bg-teal-50 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Card
            </Button>
          </div>

          {/* Smart Africa Branding */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <img src="/images/smart-africa_logo.png" alt="SA" className="w-24 h-18 rounded-full object-contain" />
              <span>Powered by Smart Africa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
