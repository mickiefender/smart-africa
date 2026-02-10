"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Loader2 } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"
import { PaymentModal } from "@/components/payment-modal"

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { initializePayment, isLoading } = usePayment()

  const plans = [
    {
      id: "starter",
      name: "BASIC",
      price: "¢500",
      priceValue: 500,
      period: "per card",
      description: "Best for students and freelancers",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "1 smart card",
        "Customer name + Logo printed on card",
        "Digital profile page",
        "Contact Info(phone, email, social)",
        "Profile photo",
        "Qr code backup",
        "Social media links"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      id: "professional",
      name: "PRO",
      price: "¢1,000",
      priceValue: 1000,
      period: "per card",
      description: "Best for professionals and enterpreneurs",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Everything in basic",
        "Google map location",
        "Whatsapp direct chat button",
        "Admin access to edit profile",
        "Cusatom design and colours for card",
      ],
      popular: true,
      buttonText: "Most Popular",
      buttonVariant: "default" as const,
    },
    {
      id: "enterprise",
      name: "PREMIUM + WEBSITE",
      price: "¢2,500",
      priceValue: 2500,
      period: "per card + website",
      description: "Best for CEOs and businesses looking to establish a strong online presence",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Landing page website (3-5 pages)",
        "Custom domain name(e.g. yourname.com)",
        "Analytics dashboard to track card interactions",
        "Priority support",
      ],
      popular: false,
      buttonText: "Request a Quote",
      buttonVariant: "secondary" as const,
    },
  ]

  const handlePlanSelect = async (plan: any) => {
    if (plan.id === "enterprise") {
      // For enterprise, show contact form or redirect to contact
      const contactSection = document.getElementById("contact")
      contactSection?.scrollIntoView({ behavior: "smooth" })
      return
    }

    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  const handlePayment = async (customerData: any, quantity = 1) => {
    if (!selectedPlan) return

    const paymentData = {
      email: customerData.email,
      amount: selectedPlan.priceValue * quantity,
      plan: selectedPlan.name,
      quantity,
      customerName: customerData.name,
      customerPhone: customerData.phone,
    }

    try {
      await initializePayment(paymentData)
    } catch (error) {
      console.error("Payment initialization failed:", error)
    }
  }

  return (
    <>
      <section id="pricing" className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border border-emerald-200">Our Plans</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Simple, transparent pricing for individuals, businesses, and enterprises. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative p-4 sm:p-6 border-2 ${
                  plan.id === "enterprise"
                    ? "border-yellow-500 shadow-xl bg-gradient-to-br from-white to-yellow-50"
                    : plan.popular
                    ? "border-emerald-500 shadow-xl lg:scale-105 bg-gradient-to-br from-white to-emerald-50"
                    : "border-emerald-200 hover:shadow-md hover:border-emerald-300"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1.5 font-semibold shadow-lg">★ Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md ${
                      plan.id === "enterprise" ? "bg-yellow-500 text-white" : "bg-emerald-500 text-white"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <CardTitle className={`text-xl font-bold ${plan.id === "enterprise" ? "text-yellow-700" : "text-emerald-700"}`}>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className={`text-2xl sm:text-3xl font-bold ${plan.id === "enterprise" ? "text-yellow-600" : "text-emerald-600"}`}>{plan.price}</span>
                    <span className={`${plan.id === "enterprise" ? "text-yellow-500" : "text-emerald-500"} ml-1 text-sm`}>{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-pretty">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          plan.id === "enterprise" ? "bg-yellow-100" : "bg-emerald-100"
                        }`}>
                          <Check className={`h-3 w-3 ${plan.id === "enterprise" ? "text-yellow-600" : "text-emerald-600"}`} />
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${
                      plan.id === "enterprise"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              All plans include free Ghana. International shipping available.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span className="flex items-center justify-center space-x-1">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>5-day money-back guarantee</span>
              </span>
              <span className="flex items-center justify-center space-x-1">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Free design consultation</span>
              </span>
              <span className="flex items-center justify-center space-x-1">
                <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Bulk discounts available</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPlan(null)
          }}
          plan={selectedPlan}
          onPayment={handlePayment}
        />
      )}
    </>
  )
}
