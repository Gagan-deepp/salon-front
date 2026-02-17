import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SummaryCardsSkeleton() {
    return (
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-3 my-8">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-sm border-slate-200">
                    <CardContent className="flex items-center gap-4 p-5">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function TableContainerSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}
