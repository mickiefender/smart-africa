"use client"

import { useState, useEffect, useCallback } from "react"
import { WebSocketClient, type PaymentUpdate } from "@/lib/websocket"

interface RealtimePaymentHook {
  paymentStatus: PaymentUpdate | null
  isConnected: boolean
  subscribeToPayment: (reference: string) => void
  unsubscribe: () => void
}

export function useRealtimePayment(): RealtimePaymentHook {
  const [paymentStatus, setPaymentStatus] = useState<PaymentUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null)

  const handleMessage = useCallback((data: PaymentUpdate) => {
    console.log("[v0] Received payment update:", data)
    setPaymentStatus(data)
  }, [])

  const handleError = useCallback((error: Event) => {
    console.error("[v0] WebSocket error:", error)
    setIsConnected(false)
  }, [])

  const subscribeToPayment = useCallback(
    (reference: string) => {
      if (typeof window !== "undefined") {
        const wsUrl =
          process.env.NODE_ENV === "development"
            ? "ws://localhost:3001/payment-updates"
            : "wss://your-websocket-server.com/payment-updates"

        const client = new WebSocketClient(wsUrl)
        client.connect(handleMessage, handleError)

        // Subscribe to specific payment reference
        client.send({
          type: "subscribe",
          reference,
        })

        setWsClient(client)
        setIsConnected(true)
      }
    },
    [handleMessage, handleError],
  )

  const unsubscribe = useCallback(() => {
    if (wsClient) {
      wsClient.disconnect()
      setWsClient(null)
      setIsConnected(false)
      setPaymentStatus(null)
    }
  }, [wsClient])

  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [unsubscribe])

  return {
    paymentStatus,
    isConnected,
    subscribeToPayment,
    unsubscribe,
  }
}
