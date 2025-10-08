import { type NextRequest, NextResponse } from "next/server"
import { PaystackService } from "@/lib/paystack"

const paystack = new PaystackService({
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  secretKey: process.env.PAYSTACK_SECRET_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference } = body

    console.log("[v0] Payment verification request body:", body)
    console.log("[v0] Reference received:", reference)

    if (!reference) {
      console.log("[v0] Missing reference in request")
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference is required",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Calling Paystack verification for reference:", reference)

    // Verify payment with Paystack
    const response = await paystack.verifyPayment(reference)

    console.log("[v0] Paystack verification response:", JSON.stringify(response, null, 2))

    if (response.status && response.data.status === "success") {
      // Payment successful - you can save to database here
      const paymentData = {
        reference: response.data.reference,
        amount: response.data.amount / 100, // Convert from kobo
        customer: response.data.customer,
        metadata: response.data.metadata,
        paidAt: response.data.paid_at,
        status: response.data.status,
      }

      console.log("[v0] Payment verification successful:", paymentData)
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: paymentData,
      })
    } else {
      console.log("[v0] Payment verification failed. Response status:", response.status)
      console.log("[v0] Response data:", response.data)

      const failureReason = response.data?.gateway_response || response.data?.status || "Unknown error"
      const customerMessage =
        response.data?.status === "abandoned"
          ? "Payment was cancelled or abandoned"
          : `Payment failed: ${failureReason}`

      return NextResponse.json(
        {
          success: false,
          message: customerMessage,
          data: {
            status: response.data?.status || "failed",
            gateway_response: response.data?.gateway_response,
            reference: response.data?.reference,
          },
          details: {
            paystackStatus: response.status,
            paystackMessage: response.message || "No message from Paystack",
            rawResponse: response.data,
          },
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
