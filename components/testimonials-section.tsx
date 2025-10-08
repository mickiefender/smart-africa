"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Pineapple",
      role: "CEO",
      company: "PineappleFix",
      image: "/images/Yussif Osmanu.jpeg",
      rating: 5,
      text: "Smart Africa's digital business cards have revolutionized how we network. The NFC feature is incredible - just tap and share! Our team's professional image has improved significantly.",
      location: "Takoradi, Ghana",
    },
    {
      name: "Mashkura",
      role: "Marketing Director",
      company: "Kimverse Luxe",
      image: "/images/Mash.JPG",
      rating: 5,
      text: "The custom branding options are fantastic. We ordered 200 cards for our team and the bulk discount made it very affordable. Customer service was exceptional throughout.",
      location: "Takoradi, Ghana",
    },
    {
      name: "Kester",
      role: "Entrepreneur",
      company: "K Clothing",
      image: "/images/kester.jpg",
      rating: 5,
      text: "As a startup founder, first impressions matter. These smart cards have helped me make memorable connections at every networking event. The analytics feature is a bonus!",
      location: "Accra, Ghana",
    },
    {
      name: "Kojo Nytro",
      role: "Artist & Music Producer",
      company: "Sound check empire",
      image: "/images/nytro-img-2.jpg",
      rating: 5,
      text: "The lead capture feature has increased our conversion rate by 40%. Clients love the modern approach, and we can track engagement in real-time. Highly recommended!",
      location: "Accra, Ghana",
    },
    
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent/10 text-accent">Customer Success Stories</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Professionals Across Africa
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Smart Africa's digital business cards are helping entrepreneurs and businesses make lasting
            connections across the continent.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-8 sm:p-12 bg-card border-2 border-border/50 shadow-lg">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Quote Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Quote className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start space-x-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg sm:text-xl text-foreground mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={testimonials[currentIndex].image || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{testimonials[currentIndex].location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button variant="outline" size="sm" onClick={prevTestimonial} className="w-10 h-10 p-0 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={nextTestimonial} className="w-10 h-10 p-0 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">15+</div>
            <div className="text-sm text-muted-foreground">African Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  )
}
