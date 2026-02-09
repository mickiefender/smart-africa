import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://vertexcards.tech"),
  title: {
    default: "Vertex Blueprint Technology - Digital Business Cards for African Professionals",
    template: "%s | Vertex Blueprint Technology",
  },
  description:
    "Create professional digital business cards with NFC technology. Perfect for modern African entrepreneurs and businesses. Fast delivery across Africa.",
  applicationName: "Vertex Blueprint Technology",
  authors: [{ name: "Vertex Blueprint Technology", url: "https://vertexcards.tech" }],
  generator: "Next.js",
  keywords: [
    "digital business cards",
    "NFC cards",
    "African business",
    "networking",
    "smart cards",
    "professional cards",
    "Vertex Blueprint Technology",
    "contactless business cards",
    "sustainable networking",
    "Ghana business cards",
    "Complementary cards",
    "personalized cards",
  ],
  creator: "Vertex Blueprint Technology",
  publisher: "Vertex Blueprint Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vertex Blueprint Technology - Digital Business Cards",
    description: "Professional digital business cards for African entrepreneurs. Share contact info instantly with NFC technology.",
    url: "https://vertexcards.tech",
    siteName: "Vertex Blueprint Technology",
    images: [
      {
        url: "/images/Untitled design (37).png",
        width: 1200,
        height: 630,
        alt: "Vertex Blueprint Technology Digital Business Cards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex Blueprint Technology - Digital Business Cards",
    description: "Professional digital business cards for African entrepreneurs. Tap to share.",
    images: ["/images/Untitled design (37).png"],
    creator: "@vertexblueprint",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "/images/Untitled design (37).png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "/images/Untitled design (37).png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Africa",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#b38e7a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
         <SpeedInsights />
      </body>
    </html>
  )
}
