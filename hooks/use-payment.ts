"use client"

import { useState } from "react"

interface PaymentData {
  email: string
  amount: number
  plan: string
  quantity: number
  customerName: string
  customerPhone: string
  customerCompany?: string
}

interface PaymentHookReturn {
  isLoading: boolean
  error: string | null
  initializePayment: (data: PaymentData) => Promise<string | null>
  verifyPayment: (reference: string) => Promise<any>
}

export function usePayment(): PaymentHookReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePayment = async (data: PaymentData): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount * 100, // Convert to kobo
          plan: data.plan,
          quantity: data.quantity,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerCompany: data.customerCompany,
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
            email: data.email,
            amount: data.amount * 100,
            currency: "GHS",
            ref: result.reference,
            callback: (response: any) => {
              // Payment successful
              console.log("[v0] Payment successful:", response)
              window.location.href = `/payment/callback?reference=${response.reference}&status=success`
            },
            onClose: () => {
              console.log("[v0] Payment popup closed")
              setIsLoading(false)
            },
          })
          handler.openIframe()
        } else {
          // Fallback to redirect if Paystack popup not available
          window.location.href = result.data.authorization_url
        }
        return result.reference
      } else {
        setError(result.message || "Failed to initialize payment")
        return null
      }
    } catch (err) {
      console.error("[v0] Payment initialization error:", err)
      setError("Failed to initialize payment. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPayment = async (reference: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      })

      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        setError(result.message || "Payment verification failed")
        return null
      }
    } catch (err) {
      console.error("[v0] Payment verification error:", err)
      setError("Failed to verify payment. Please contact support.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    initializePayment,
    verifyPayment,
  }
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        callback: (response: any) => void
        onClose: () => void
      }) => {
        openIframe: () => void
      }
    }
  }
}
