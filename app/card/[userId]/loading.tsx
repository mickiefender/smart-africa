import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header Skeleton */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-24 h-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="w-24 h-6 mb-6" />

          {/* Business Card Skeleton */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Cover */}
            <Skeleton className="h-32 w-full" />

            {/* Profile */}
            <div className="pt-16 px-6 pb-6">
              <div className="absolute -mt-28 left-1/2 transform -translate-x-1/2">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>

              <div className="text-center mb-4">
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto mb-1" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>

              <Skeleton className="h-16 w-full mb-6" />

              <div className="space-y-3 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-18 rounded-full" />
              </div>

              <Skeleton className="h-6 w-20 mx-auto" />
            </div>
          </div>

          {/* Actions Skeleton */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-64 mx-auto mb-4" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
