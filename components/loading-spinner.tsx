"use client"

import { useEffect, useState } from "react"

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <img src="/images/smart-africa_logo.png" alt="Smart Africa" className="w-24 h-24 mx-auto animate-pulse" />
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="text-muted-foreground">Please wait{dots}</p>
        </div>
      </div>
    </div>
  )
}

export { LoadingSpinner }
