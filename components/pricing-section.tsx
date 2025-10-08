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
      name: "Starter",
      price: "¢200",
      priceValue: 200,
      period: "per card",
      description: "Perfect for individuals and small businesses",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Digital business card",
        "QR code sharing",
        "Contact info management",
        "Basic analytics",
        "Mobile optimized",
        "Email support",
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      id: "professional",
      name: "Professional",
      price: "¢250",
      priceValue: 250,
      period: "per card",
      description: "Best for growing businesses and professionals",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Everything in Starter",
        "NFC-enabled physical card",
        "Custom branding & colors",
        "Social media integration",
        "Advanced analytics",
        "Lead capture forms",
        "Priority support",
      ],
      popular: true,
      buttonText: "Most Popular",
      buttonVariant: "default" as const,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "¢400",
      priceValue: 400,
      period: "per card",
      description: "For large teams and corporations",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Everything in Professional",
        "Team management dashboard",
        "Bulk ordering discounts",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      popular: false,
      buttonText: "Contact Sales",
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
            <Badge className="mb-4 bg-secondary/10 text-secondary">Transparent Pricing</Badge>
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
                className={`relative p-4 sm:p-6 ${
                  plan.popular
                    ? "border-2 border-primary shadow-lg lg:scale-105"
                    : "border border-border hover:shadow-md"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      plan.popular ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-pretty">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            plan.popular ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <Check className={`h-3 w-3 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}`}
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
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>30-day money-back guarantee</span>
              </span>
              <span className="flex items-center justify-center space-x-1">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Free design consultation</span>
              </span>
              <span className="flex items-center justify-center space-x-1">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
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
