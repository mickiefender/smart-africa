"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SlidingBanner() {
  const banners = [
    {
      id: 1,
      image: "/images/front.png",
      title: "Professional Business Cards",
      subtitle: "Make lasting impressions with premium digital cards",
    },
    {
      id: 2,
      image: "/images/lady with card.png",
      title: "Smart Networking Solutions",
      subtitle: "Connect instantly with NFC-enabled cards",
    },
    {
      id: 3,
      image: "/images/hand holding card.png",
      title: "Modern Digital Identity",
      subtitle: "Stand out with customizable designs",
    },
    {
      id: 4,
      image: "/images/image-slider4.jpg",
      title: "Seamless Contact Sharing",
      subtitle: "Share your details with a simple tap",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-teal-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="relative h-58 sm:h-94 md:h-80 lg:h-150 rounded-2xl overflow-hidden shadow-xl">
          {/* Banner Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="min-w-full h-full relative bg-gradient-to-r from-orange-500/90 to-teal-600/90"
              >
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover mix-blend-overlay"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-balance">
                      {banner.title}
                    </h3>
                    <p className="text-sm sm:text-lg md:text-xl opacity-90 text-pretty">{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
