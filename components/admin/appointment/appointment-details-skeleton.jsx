import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AppointmentDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/3" />
        
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
