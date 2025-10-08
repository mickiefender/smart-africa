import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SA</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Smart Africa</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Card Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              The digital business card you're looking for doesn't exist or may have been removed.
            </p>

            <div className="space-y-2">
              <Link href="/search">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Want to create your own card?</p>
              <Link href="/auth/sign-up">
                <Button variant="outline" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
