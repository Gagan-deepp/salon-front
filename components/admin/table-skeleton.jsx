import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-64" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 border-2 rounded-3xl animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <Skeleton className="h-3 w-full mb-4" />
          <Skeleton className="h-3 w-3/4 mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex justify-between text-sm pt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const PaymentSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left Card - Form Skeleton */}
      <Card className="flex-1 lg:flex-[2] p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>

            {/* Form Content */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>

                {/* Service/Product Items */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Right Card - Bill Summary Skeleton */}
      <Card className="lg:flex-1 p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Bill Items */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}