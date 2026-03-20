"use client"

import { Play, Youtube } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoSectionProps {
  videoId: string
}

export function VideoSection({ videoId }: VideoSectionProps) {
  return (
    <section id="video" className="py-16 sm:py-20 bg-gradient-to-br from-orange-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <Youtube className="h-5 w-5" />
            <span className="font-semibold">Watch Video</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Watch How Vertex Cards Work
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            See our digital business cards in action and discover why thousands of professionals trust Vertex Cards.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-emerald-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1`}
                  title="Vertex Cards Demo"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

