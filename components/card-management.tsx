"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, TrendingUp, Calendar, Edit } from "lucide-react"

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
  avatar_url?: string
  cover_image_url?: string
  theme_color: string
  created_at?: string
}

interface CardManagementProps {
  profile: Profile
  isOwner: boolean
}

export function CardManagement({ profile, isOwner }: CardManagementProps) {
  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About This Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            This is a digital business card powered by Smart Africa. Connect instantly by tapping your NFC-enabled
            device or scanning the QR code.
          </div>
          <Badge variant="secondary" className="w-fit">
            Digital Business Card
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Card Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Eye className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-orange-600">127</div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-lg">
              <Users className="h-5 w-5 text-teal-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-teal-600">43</div>
              <div className="text-xs text-gray-600">Contacts</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>+12% this week</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/profile/edit" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </a>
          <a href="/schedule" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </a>
          <a href="/connections" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              View Connections
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
