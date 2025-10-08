// WebSocket client for real-time updates
export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private url: string) {}

  connect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        this.attemptReconnect(onMessage, onError)
      }

      this.ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        if (onError) onError(error)
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket connection:", error)
    }
  }

  private attemptReconnect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`[v0] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(onMessage, onError)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Real-time payment status updates
export interface PaymentUpdate {
  reference: string
  status: "pending" | "processing" | "success" | "failed"
  message: string
  timestamp: string
}
