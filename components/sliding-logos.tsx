"use client"

import { useEffect, useState } from "react"

const partnerLogos = [
  {
    name: "Baltic-properties",
    logo: "/images/logos/Baltic-properties-logo.png",
  },
  {
    name: "Kimverse Luxe",
    logo: "/images/logos/kimverse-logo.png",
  },
  {
    name: "Mico Herbal",
    logo: "/images/logos/Micoherbal-logo.jpg",
  },

  {
    name: "Snaptic",
    logo: "/images/logos/snaptic-logo.png",
  },
 
]

export default function SlidingLogos() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Duplicate the logos array to create seamless loop
  const duplicatedLogos = [...partnerLogos, ...partnerLogos]

  return (
    <section className="py-12 sm:py-16 bg-gray-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Trusted by Leading Organizations</h2>
          <p className="text-gray-600">Partnering with Africa's most innovative companies and institutions</p>
        </div>
      </div>

      <div className="relative">
        <div className="flex animate-slide-left">
          {duplicatedLogos.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ minWidth: "150px" }}
            >
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="h-12 sm:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
