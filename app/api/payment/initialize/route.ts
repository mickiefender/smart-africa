import { type NextRequest, NextResponse } from "next/server"
import { PaystackService } from "@/lib/paystack"

const paystack = new PaystackService({
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  secretKey: process.env.PAYSTACK_SECRET_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Payment request body:", body)

    const { email, amount, plan, quantity, customerName, customerPhone, customerCompany } = body

    if (!email || !amount || !customerName) {
      console.log("[v0] Missing required fields:", { email: !!email, amount: !!amount, customerName: !!customerName })
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: email, amount, and customerName are required",
        },
        { status: 400 },
      )
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[v0] Missing PAYSTACK_SECRET_KEY environment variable")
      return NextResponse.json(
        {
          success: false,
          message: "Payment service not configured. Missing secret key.",
        },
        { status: 500 },
      )
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      console.error("[v0] Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable")
      return NextResponse.json(
        {
          success: false,
          message: "Payment service not configured. Missing public key.",
        },
        { status: 500 },
      )
    }

    let reference = paystack.generateReference()
    let attempts = 0
    const maxAttempts = 3

    // Prepare payment data
    const paymentData = {
      email,
      amount: amount, // Amount already in kobo from frontend
      currency: "GHS",
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
      metadata: {
        cardType: plan || "Digital Business Card",
        quantity: quantity.toString(),
        customerName,
        phone: customerPhone,
        company: customerCompany || "",
      },
    }

    console.log("[v0] Payment data prepared:", paymentData)

    while (attempts < maxAttempts) {
      try {
        const response = await paystack.initializePayment(paymentData)
        console.log("[v0] Paystack response:", response)

        if (response.status) {
          return NextResponse.json({
            success: true,
            data: response.data,
            reference,
            publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          })
        } else if (response.message?.includes("duplicate") || response.message?.includes("reference")) {
          // Generate new reference and retry
          reference = paystack.generateReference()
          paymentData.reference = reference
          attempts++
          continue
        } else {
          console.log("[v0] Paystack error:", response.message)
          return NextResponse.json(
            {
              success: false,
              message: response.message || "Failed to initialize payment with Paystack",
            },
            { status: 400 },
          )
        }
      } catch (error) {
        attempts++
        if (attempts >= maxAttempts) {
          throw error
        }
        // Generate new reference for retry
        reference = paystack.generateReference()
        paymentData.reference = reference
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate unique payment reference after multiple attempts",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize payment. Please check your connection and try again.",
      },
      { status: 500 },
    )
  }
}
