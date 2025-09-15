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

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference is required",
        },
        { status: 400 },
      )
    }

    // Verify payment with Paystack
    const response = await paystack.verifyPayment(reference)

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

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: paymentData,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          data: response.data,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}
