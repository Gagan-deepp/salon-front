import { Suspense } from "react"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDashboard } from "@/components/admin/franchise-dashboard/franchise-dashboard"
import { FranchiseDashboardSkeleton } from "@/components/admin/franchise-dashboard/franchise-dashboard-skeleton"
import { notFound } from "next/navigation"
import { getCustomerData, getMetrics, getSalesData } from "@/lib/actions/analytics_action"
import { Card, CardContent } from "@/components/ui/card"


export default async function FranchisePage({ params }) {
    const id = (await params).id
    const [result, metrics, customerData, salesData] = await Promise.all([getFranchiseById(id), getMetrics(id), getCustomerData(), getSalesData()]);

    if (!result.success || !customerData.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Failed to load branch : {result.error || customerData.error}</p>
                </CardContent>
            </Card>
        );
    }

    const franchise = result.data.data

    if (!franchise) {
        notFound()
    }
    return (
        <div className="p-6">
            <Suspense fallback={<FranchiseDashboardSkeleton />}>
                <FranchiseDashboard metrics={metrics.data} franchise={franchise} customerData={customerData.data.data} salesData={salesData.data} />
            </Suspense>
        </div>
    )
}
