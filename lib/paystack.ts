// Paystack integration utilities
export interface PaystackConfig {
  publicKey: string
  secretKey: string
}

export interface PaymentData {
  email: string
  amount: number // in kobo (Ghanaian currency)
  currency: string
  reference: string
  callback_url?: string
  metadata?: {
    cardType: string
    quantity: string
    customerName: string
    phone: string
    company?: string
  }
}

export interface PaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export class PaystackService {
  private publicKey: string
  private secretKey: string
  private baseUrl = "https://api.paystack.co"

  constructor(config: PaystackConfig) {
    this.publicKey = config.publicKey
    this.secretKey = config.secretKey
  }

  // Initialize payment
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Paystack initialization error:", error)
      throw new Error("Failed to initialize payment")
    }
  }

  // Verify payment
  async verifyPayment(reference: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Paystack verification error:", error)
      throw new Error("Failed to verify payment")
    }
  }

  // Generate payment reference
  generateReference(): string {
    return `SA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Pricing configuration
export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    price: 15000, // in kobo
    displayPrice: "GHS200",
    features: ["1 Digital Card", "Basic Templates", "Email Support"],
  },
  professional: {
    name: "Professional",
    price: 25000, // in kobo
    displayPrice: "GHS350",
    features: ["2 Digital Cards", "Premium Templates", "NFC Support", "Priority Support"],
  },
  enterprise: {
    name: "Enterprise",
    price: 30000, // in kobo
    displayPrice: "GHS300",
    features: ["Unlimited Cards", "Custom Branding", "API Access", "24/7 Support"],
  },
}
