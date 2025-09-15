"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WhatsAppService } from "@/lib/whatsapp"

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show the floating button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
      // Show tooltip after another 2 seconds
      setTimeout(() => setShowTooltip(true), 2000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Hide tooltip after 5 seconds
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  const handleClick = () => {
    const message = `Hello Smart Africa Team! 👋

I'm visiting your website and I'm interested in your digital business cards. Could you please help me with:

• Information about your services
• Pricing details
• How to get started
• Any current promotions

Looking forward to hearing from you!`

    WhatsAppService.sendToWhatsApp({
      type: "inquiry",
      customerName: "Website Visitor",
      email: "",
      phone: "",
      message,
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <Card className="absolute bottom-16 right-0 w-64 mb-2 shadow-lg animate-in slide-in-from-bottom-2">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Need help? 💬</p>
                <p className="text-xs text-gray-600">Chat with us on WhatsApp for instant support!</p>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2" onClick={() => setShowTooltip(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Button */}
      <Button
        onClick={handleClick}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        size="sm"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
