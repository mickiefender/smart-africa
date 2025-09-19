"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, Clock, X, Plus, Minus, AlertCircle } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"
import { useRealtimePayment } from "@/hooks/use-realtime-payment"
import { ReceiptModal } from "@/components/receipt-modal"
import { useWhatsApp } from "@/hooks/use-whatsapp"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: string
    priceValue: number
    description: string
  }
  onPayment: (customerData: any, quantity: number) => void
}

export function PaymentModal({ isOpen, onClose, plan, onPayment }: PaymentModalProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [quantity, setQuantity] = useState(1)
  const [paymentReference, setPaymentReference] = useState<string | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { initializePayment, isLoading, error } = usePayment()
  const { paymentStatus, subscribeToPayment, unsubscribe } = useRealtimePayment()
  const { sendReceiptToWhatsApp } = useWhatsApp()

  const totalAmount = plan.priceValue * quantity

  const validateForm = () => {
    if (!customerData.name.trim()) return "Full name is required"
    if (!customerData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      return "Please enter a valid email address"
    }
    if (!customerData.phone.trim() || !/^[+]?[0-9\s\-]{10,}$/.test(customerData.phone)) {
      return "Please enter a valid phone number"
    }
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handlePayment = async () => {
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }
    setFormError(null)

    const paymentData = {
      email: customerData.email,
      amount: totalAmount,
      plan: plan.name,
      quantity,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerCompany: customerData.company,
    }

    try {
      const reference = await initializePayment(paymentData)
      if (reference) {
        setPaymentReference(reference)
        subscribeToPayment(reference)
      }
    } catch (err) {
      console.error("Payment initialization failed:", err)
    }
  }

  const handleClose = () => {
    unsubscribe()
    setPaymentReference(null)
    setShowReceipt(false)
    setReceiptData(null)
    setFormError(null)
    onClose()
  }

  const handleRetryPayment = () => {
    setPaymentReference(null)
    unsubscribe()
    handlePayment()
  }

  const handleSendToWhatsApp = () => {
    if (receiptData) {
      sendReceiptToWhatsApp(receiptData)
    }
  }

  useEffect(() => {
    if (paymentStatus?.status === "success" && paymentReference) {
      const receipt = {
        reference: paymentReference,
        planName: plan.name,
        cardType: "Digital Business Card",
        quantity: quantity,
        amount: totalAmount,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        date: new Date().toISOString(),
        status: "paid",
      }

      setReceiptData(receipt)
      setShowReceipt(true)

      setTimeout(() => {
        setPaymentReference(null)
      }, 1000)
    }
  }, [paymentStatus, paymentReference, plan, quantity, totalAmount, customerData])

  if (!isOpen) return null

  if (showReceipt && receiptData) {
    return (
      <ReceiptModal
        isOpen={true}
        onClose={handleClose}
        receiptData={receiptData}
        onSendToWhatsApp={handleSendToWhatsApp}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2 pr-8">
            Complete Your Order
            {paymentStatus && (
              <Badge
                variant={
                  paymentStatus.status === "success"
                    ? "default"
                    : paymentStatus.status === "failed"
                      ? "destructive"
                      : "secondary"
                }
              >
                {paymentStatus.status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {formError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {!paymentReference && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Information</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={customerData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
            </div>
          )}

          {!paymentReference && (
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} className="h-10 w-10">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per card:</span>
              <span>{plan.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-orange-600">¢{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {paymentStatus && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                paymentStatus.status === "failed" ? "bg-red-50 border border-red-200" : "bg-gray-50"
              }`}
            >
              {paymentStatus.status === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
              {paymentStatus.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
              {paymentStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {paymentStatus.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">{paymentStatus.message}</span>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            {!paymentReference && (
              <Button onClick={handlePayment} disabled={isLoading} className="flex-1 bg-orange-600 hover:bg-orange-700">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ¢${totalAmount.toLocaleString()}`
                )}
              </Button>
            )}
            {paymentReference && paymentStatus?.status === "failed" && (
              <Button
                onClick={handleRetryPayment}
                disabled={isLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  "Retry Payment"
                )}
              </Button>
            )}
          </div>

          {paymentReference && <div className="text-xs text-gray-500 text-center">Reference: {paymentReference}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
