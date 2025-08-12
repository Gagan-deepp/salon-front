import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function UserDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
