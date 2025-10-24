import { Suspense } from "react"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDashboard } from "@/components/admin/franchise-dashboard/franchise-dashboard"
import { FranchiseDashboardSkeleton } from "@/components/admin/franchise-dashboard/franchise-dashboard-skeleton"
import { auth } from "@/lib/auth"
import { getCustomerData, getMetrics, getSalesData } from "@/lib/actions/analytics_action"

async function FranchiseData() {
  // For demo purposes, using a fixed franchise ID
  // In real implementation, this could come from user session or context

  const session = await auth()
  const franchiseId = session?.franchiseId

  console.log("franchise id of user ==> ", franchiseId)
  // const result = await getFranchiseById(franchiseId)
  const [result, metrics, customerData, salesData] = await Promise.all([getFranchiseById(franchiseId), getMetrics(), getCustomerData(), getSalesData()]);


  // Enhanced dummy data based on your schema
  const franchise = result.data.data

  return <FranchiseDashboard metrics={metrics.data} franchise={franchise} customerData={customerData.data.data} salesData={salesData.data} />;
}

export default function FranchisePage() {
  return (
    <div className="p-6">
      <Suspense fallback={<FranchiseDashboardSkeleton />}>
        <FranchiseData />
      </Suspense>
    </div>
  );
}
