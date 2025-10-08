"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Share2, CheckCircle, Copy, MessageCircle } from "lucide-react"
import { ReceiptGenerator } from "@/lib/receipt-generator"
import type { ReceiptData } from "@/lib/receipt-generator"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receiptData: ReceiptData
  onSendToWhatsApp: () => void
}

export function ReceiptModal({ isOpen, onClose, receiptData, onSendToWhatsApp }: ReceiptModalProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    ReceiptGenerator.downloadReceipt(receiptData)
  }

  const handlePrint = () => {
    ReceiptGenerator.printReceipt(receiptData)
  }

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(receiptData.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy reference:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Smart Africa Payment Receipt",
          text: `Payment successful! Reference: ${receiptData.reference}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your order!</h3>
            <p className="text-gray-600">
              Your payment has been processed successfully. You will receive your digital business cards within 24-48
              hours.
            </p>
          </div>

          {/* Receipt Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Reference Number:</span>
              <div className="flex items-center gap-2">
                <code className="bg-white px-2 py-1 rounded text-sm font-mono">{receiptData.reference}</code>
                <Button variant="ghost" size="sm" onClick={handleCopyReference} className="h-8 w-8 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Plan:</span>
              <span className="text-sm text-gray-900">{receiptData.planName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Card Type:</span>
              <span className="text-sm text-gray-900">{receiptData.cardType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Quantity:</span>
              <span className="text-sm text-gray-900">{receiptData.quantity}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold text-gray-900">Total Paid:</span>
              <span className="text-lg font-bold text-orange-600">¢{receiptData.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Copy Success Message */}
          {copied && (
            <div className="text-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Reference number copied!
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>

            {typeof navigator.share === "function" && (
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 mb-1">Send Receipt to WhatsApp</h4>
                <p className="text-sm text-green-700 mb-3">
                  Share your receipt with our team on WhatsApp for faster processing and support.
                </p>
                <Button onClick={onSendToWhatsApp} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send to WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-transparent" variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
