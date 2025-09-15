"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { WhatsAppService } from "@/lib/whatsapp"

interface WhatsAppButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({
  variant = "default",
  size = "default",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = `Hello Smart Africa Team! 👋

I'm interested in learning more about your digital business cards. Could you please provide me with more information about:

• Available card types and designs
• Pricing and packages
• Delivery timeline
• Customization options

Thank you!`

    WhatsAppService.sendToWhatsApp({
      type: "inquiry",
      customerName: "Potential Customer",
      email: "",
      phone: "",
      message,
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      {children || "Chat on WhatsApp"}
    </Button>
  )
}
