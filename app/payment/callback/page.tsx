"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"
import { ReceiptModal } from "@/components/receipt-modal"
import type { ReceiptData } from "@/lib/receipt-generator"

export default function PaymentCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyPayment, isLoading } = usePayment()

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed">("loading")
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const reference = searchParams.get("reference")

  useEffect(() => {
    if (reference) {
      handleVerifyPayment(reference)
    } else {
      setVerificationStatus("failed")
    }
  }, [reference])

  const handleVerifyPayment = async (ref: string) => {
    try {
      const result = await verifyPayment(ref)

      if (result) {
        setVerificationStatus("success")

        // Create receipt data from payment result
        const receipt: ReceiptData = {
          reference: result.reference,
          customerName: result.metadata?.customerName || result.customer.first_name + " " + result.customer.last_name,
          email: result.customer.email,
          phone: result.metadata?.phone || "",
          company: result.metadata?.company,
          cardType: result.metadata?.cardType || "Standard Digital",
          quantity: result.metadata?.quantity || "1",
          planName: result.metadata?.planName || "", // This should come from metadata
          amount: result.amount,
          paidAt: result.paidAt,
          transactionId: result.reference,
        }

        setReceiptData(receipt)
        setShowReceipt(true)
      } else {
        setVerificationStatus("failed")
      }
    } catch (error) {
      console.error("Payment verification failed:", error)
      setVerificationStatus("failed")
    }
  }

  const handleSendToWhatsApp = () => {
    if (receiptData) {
      const message = `Hello Smart Africa Team! 

I've just completed my payment for digital business cards. Here are my order details:

📋 *Order Details:*
• Reference: ${receiptData.reference}
• Plan: ${receiptData.planName}
• Card Type: ${receiptData.cardType}
• Quantity: ${receiptData.quantity}
• Amount Paid: ¢${receiptData.amount.toLocaleString()}

👤 *Customer Information:*
• Name: ${receiptData.customerName}
• Email: ${receiptData.email}
• Phone: ${receiptData.phone}
${receiptData.company ? `• Company: ${receiptData.company}` : ""}

Please confirm receipt of this payment and let me know the next steps for my digital business cards.

Thank you!`

      const whatsappUrl = `https://wa.me/233208517482?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {verificationStatus === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
            {verificationStatus === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {verificationStatus === "failed" && <XCircle className="h-6 w-6 text-red-600" />}

            {verificationStatus === "loading" && "Verifying Payment..."}
            {verificationStatus === "success" && "Payment Successful!"}
            {verificationStatus === "failed" && "Payment Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {verificationStatus === "loading" && (
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          )}

          {verificationStatus === "success" && (
            <div className="space-y-4">
              <p className="text-gray-600">Your payment has been successfully processed. Your receipt is ready!</p>
              <Button onClick={() => setShowReceipt(true)} className="w-full bg-orange-600 hover:bg-orange-700">
                View Receipt
              </Button>
            </div>
          )}

          {verificationStatus === "failed" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                We couldn't verify your payment. Please contact support if you believe this is an error.
              </p>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          receiptData={receiptData}
          onSendToWhatsApp={handleSendToWhatsApp}
        />
      )}
    </div>
  )
}
