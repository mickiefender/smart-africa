import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/images/smart-africa_logo.png"
                alt="Smart Africa"
                className="w-12 h-12 rounded-lg object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Smart Africa</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm prose lg:prose-lg">{children}</div>
        </div>
      </main>
    </div>
  )
}