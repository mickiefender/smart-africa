import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Globe, Smartphone, Star } from "lucide-react"
import ContactForm from "@/components/contact-form"
import PricingSection from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import SlidingBanner from "@/components/sliding-banner"
import SlidingLogos from "@/components/sliding-logos"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/images/smart-africa_logo.png"
                alt="Smart Africa"
                className="w-12 h-12 rounded-lg object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Smart Africa</span>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200">
              Digital Business Cards for Africa
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 text-balance">
              Create Your
              <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">
                {" "}
                Digital Business Card
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto px-4 sm:px-0">
              Connect, share, and grow your network with beautiful, professional digital business cards. Perfect for the
              modern African entrepreneur.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
              <Link href="#contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto !bg-gradient-to-r !from-orange-500 !to-teal-600 hover:!from-orange-600 hover:!to-teal-700 !text-white px-6 sm:px-8 border-0"
                >
                  Order Your Cards
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 bg-transparent">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Profile Images Grid */}
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1">
                  <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-teal-500 rounded-full flex items-center justify-center">
                  <Star className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>

              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                  <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 p-1">
                <div className="w-full h-full rounded-full bg-teal-500 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">1K+</div>
              <div className="text-gray-600 text-xs sm:text-sm">Cards Created</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 text-xs sm:text-sm">Countries</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">5K+</div>
              <div className="text-gray-600 text-xs sm:text-sm">Connections Made</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">99%</div>
              <div className="text-gray-600 text-xs sm:text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for digital networking
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Our platform provides all the tools you need to create, share, and manage your professional digital
              presence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Profile Creation</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Create your professional digital business card in minutes with our intuitive interface.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Share your card anywhere in the world with a simple link or QR code.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your digital business card looks perfect on any device, anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sliding Banner */}
      <SlidingBanner />

      {/* Sliding Logos Section */}
      <SlidingLogos />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-500 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to go digital?</h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of professionals who have already made the switch to digital business cards.
          </p>
          <Link href="#contact">
            <Button size="lg" variant="secondary" className="px-6 sm:px-8 !bg-white !text-gray-900 hover:!bg-gray-100">
              Get Your Quote Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/images/smart-africa_logo.png"
                  alt="Smart Africa"
                  className="w-8 h-8 rounded-lg object-contain"
                />
                <span className="text-lg sm:text-xl font-bold">Smart Africa</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Empowering African professionals with digital business solutions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm">&copy; 2024 Smart Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  )
}
