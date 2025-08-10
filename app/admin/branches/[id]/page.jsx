import { Suspense } from "react"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDashboard } from "@/components/admin/franchise-dashboard/franchise-dashboard"
import { FranchiseDashboardSkeleton } from "@/components/admin/franchise-dashboard/franchise-dashboard-skeleton"
import { notFound } from "next/navigation"


export default async function FranchisePage({ params }) {

    const result = await getFranchiseById((await params).id)

    console.log("\n\n Specific Franchise result ===> ", result.data)
    const franchise = result.data.data

    if (!franchise) {
        notFound()
    }
    return (
        <div className="p-6">
            <Suspense fallback={<FranchiseDashboardSkeleton />}>
                <FranchiseDashboard franchise={franchise} />
            </Suspense>
        </div>
    )
}
