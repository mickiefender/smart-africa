"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { usePayment } from "@/hooks/use-payment"

interface PaystackPaymentProps {
  amount: number
  email?: string
  onSuccess?: (reference: string) => void
  onClose?: () => void
}

export function PaystackPayment({ amount, email: defaultEmail = "", onSuccess, onClose }: PaystackPaymentProps) {
  const [email, setEmail] = useState(defaultEmail)
  const { toast } = useToast()

  const { initializePayment, isLoading, error } = usePayment()

  const handlePayment = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    try {
      const reference = await initializePayment({
        email,
        amount,
        plan: "Simple Payment",
        quantity: 1,
        customerName: "Customer", // You might want to add a name field
        customerPhone: "", // You might want to add a phone field
      })

      if (reference) {
        onSuccess?.(reference)
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Amount: ¢{amount.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

        <Button onClick={handlePayment} disabled={isLoading || !email} className="w-full">
          {isLoading ? "Initializing..." : `Pay ¢${amount.toLocaleString()}`}
        </Button>
      </CardContent>
    </Card>
  )
}
