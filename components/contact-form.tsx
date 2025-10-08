"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, CreditCard, Loader2 } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { useWhatsApp } from "@/hooks/use-whatsapp"

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({
    id: "professional",
    name: "Professional",
    price: "¢300",
    priceValue: 300,
    description: "Best for growing businesses and professionals",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sendOrderToWhatsApp } = useWhatsApp()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    cardType: "",
    quantity: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Form submission started:", formData)

      sendOrderToWhatsApp({
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        cardType: formData.cardType,
        quantity: formData.quantity,
        message: formData.message || "New order request from website contact form",
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Form submitted successfully")
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          cardType: "",
          quantity: "",
          message: "",
        })
      }, 5000)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.cardType || !formData.quantity) {
      alert("Please fill in all required fields before proceeding to payment.")
      return
    }
    setShowPaymentModal(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    console.log(`[v0] Form field updated: ${field} = ${value}`)
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-6 sm:p-8 border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                  Your inquiry has been submitted successfully and sent to our WhatsApp. We'll get back to you within 24
                  hours.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-sm sm:text-base"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      sendOrderToWhatsApp({
                        customerName: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        cardType: formData.cardType,
                        quantity: formData.quantity,
                        message: "Following up on my order request",
                      })
                    }}
                    className="border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>

                <Badge className="bg-primary/10 text-primary text-xs sm:text-sm">Response within 24 hours</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="contact" className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">Get Your Smart Cards</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Ready to Order Your Digital Business Cards?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Fill out the form below and we'll get back to you with a custom quote and timeline for your smart card
              order.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">Email</p>
                      <p className="text-muted-foreground text-sm sm:text-base break-all"><a href="mailto:smartafrica99@gmail.com">smartafrica99@gmail.com</a></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">Phone</p>
                      <p className="text-muted-foreground text-sm sm:text-base"><a href="tel:+233208517482">+233 208 517 482</a><br /><a href="tel:+233206995489">+233 206 995 489</a></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">Location</p>
                      <p className="text-muted-foreground text-sm sm:text-base">Takoradi, Ghana</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">WhatsApp</p>
                      <p className="text-muted-foreground text-sm sm:text-base"><a href="https://wa.me/233206995489" target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-4 sm:p-6 bg-primary/5 border-primary/20">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-base sm:text-lg text-foreground">Why Choose Smart Africa?</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span>Fast 3-5 day delivery across Africa</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span>Custom branding and design options</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span>Bulk order discounts available</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="p-4 sm:p-6 lg:p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg sm:text-xl text-foreground">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Michael Coleman"
                        required
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="smartafrica99@gmail.com"
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+233 208 517 482"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="Your Company"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardType" className="text-sm">
                        Card Type *
                      </Label>
                      <Select value={formData.cardType} onValueChange={(value) => handleChange("cardType", value)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Digital Card</SelectItem>
                          <SelectItem value="premium">Premium NFC Card</SelectItem>
                          <SelectItem value="custom">Custom Design Card</SelectItem>
                          <SelectItem value="bulk">Bulk Corporate Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm">
                        Quantity *
                      </Label>
                      <Select value={formData.quantity} onValueChange={(value) => handleChange("quantity", value)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 cards</SelectItem>
                          <SelectItem value="11-50">11-50 cards</SelectItem>
                          <SelectItem value="51-100">51-100 cards</SelectItem>
                          <SelectItem value="100+">100+ cards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm">
                      Additional Requirements
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tell us about your specific requirements, design preferences, or any questions you have..."
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmitting}
                      className="w-full bg-transparent text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Quote Request
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handlePayNow}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                      disabled={!formData.name || !formData.email || !formData.cardType || !formData.quantity}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  </div>

                  <div className="text-center pt-4 border-t">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">Need immediate assistance?</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        sendOrderToWhatsApp({
                          customerName: formData.name || "Website Visitor",
                          email: formData.email || "",
                          phone: formData.phone || "",
                          company: formData.company,
                          cardType: formData.cardType || "General Inquiry",
                          quantity: formData.quantity || "Not specified",
                          message: "I need immediate assistance with my order",
                        })
                      }}
                      className="border-green-600 text-green-600 hover:bg-green-50 text-sm"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          onPayment={() => {}}
        />
      )}
    </>
  )
}
