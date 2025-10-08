"use client"

import { useState, useEffect, useCallback } from "react"

interface PaymentStatus {
  status: "pending" | "processing" | "success" | "failed"
  message: string
  reference?: string
}

interface RealtimePaymentHook {
  paymentStatus: PaymentStatus | null
  subscribeToPayment: (reference: string) => void
  unsubscribe: () => void
}

export function useRealtimePayment(): RealtimePaymentHook {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const subscribeToPayment = useCallback((reference: string) => {
    setPaymentStatus({
      status: "pending",
      message: "Payment initiated, waiting for confirmation...",
      reference,
    })

    let pollCount = 0
    const maxPolls = 40 // 2 minutes max (40 * 3 seconds)

    // Poll for payment status every 3 seconds
    const id = setInterval(async () => {
      try {
        pollCount++
        console.log(`[v0] Polling payment status for ${reference}, attempt ${pollCount}`)

        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        })

        const result = await response.json()
        console.log(`[v0] Payment verification result:`, result)

        if (result.success && result.data?.status === "success") {
          setPaymentStatus({
            status: "success",
            message: "Payment successful!",
            reference,
          })
          clearInterval(id)
        } else if (!result.success || result.data?.status === "failed" || result.data?.status === "abandoned") {
          setPaymentStatus({
            status: "failed",
            message: result.message || "Payment failed. Please try again.",
            reference,
          })
          clearInterval(id)
        } else if (pollCount >= maxPolls) {
          setPaymentStatus({
            status: "failed",
            message: "Payment verification timeout. Please contact support if payment was deducted.",
            reference,
          })
          clearInterval(id)
        } else {
          setPaymentStatus({
            status: "processing",
            message: `Processing payment... (${pollCount}/${maxPolls})`,
            reference,
          })
        }
      } catch (error) {
        console.error("[v0] Payment status check error:", error)
        pollCount++

        if (pollCount >= maxPolls) {
          setPaymentStatus({
            status: "failed",
            message: "Unable to verify payment status. Please contact support.",
            reference,
          })
          clearInterval(id)
        }
      }
    }, 3000)

    setIntervalId(id)
  }, [])

  const unsubscribe = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setPaymentStatus(null)
  }, [intervalId])

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  return {
    paymentStatus,
    subscribeToPayment,
    unsubscribe,
  }
}
