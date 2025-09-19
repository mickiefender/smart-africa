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
      const amountInKobo = data.amount * 100

      const requestBody = {
        email: data.email,
        amount: amountInKobo,
        plan: data.plan,
        quantity: data.quantity,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerCompany: data.customerCompany,
        timestamp: Date.now(), // Force fresh request
      }

      console.log("[v0] Initializing payment with data:", requestBody)

      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log("[v0] Payment initialization result:", result)

      if (!result.success) {
        setError(result.message || "Failed to initialize payment")
        return null
      }

      const waitForPaystack = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (window.PaystackPop) {
            resolve(true)
            return
          }

          let attempts = 0
          const maxAttempts = 30 // 3 seconds

          const check = () => {
            if (window.PaystackPop) {
              resolve(true)
              return
            }

            attempts++
            if (attempts >= maxAttempts) {
              resolve(false)
              return
            }

            setTimeout(check, 100)
          }

          check()
        })
      }

      const paystackReady = await waitForPaystack()
      if (!paystackReady) {
        setError("Payment system not ready. Please refresh and try again.")
        return null
      }

      const { publicKey, reference } = result

      if (!publicKey || !reference) {
        setError("Payment configuration error. Please try again.")
        return null
      }

      console.log("[v0] Setting up Paystack with reference:", reference)

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: data.email,
        amount: amountInKobo, // Already in kobo
        currency: "GHS",
        ref: reference,
        callback: (response: any) => {
          console.log("[v0] Payment callback received:", response)
          window.location.href = `/payment/callback?reference=${response.reference}&status=success`
        },
        onClose: () => {
          console.log("[v0] Payment modal closed")
          setIsLoading(false)
        },
      })

      handler.openIframe()

      return reference
    } catch (err) {
      console.error("[v0] Payment error:", err)
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
