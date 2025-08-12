import { Suspense } from "react"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDashboard } from "@/components/admin/franchise-dashboard/franchise-dashboard"
import { FranchiseDashboardSkeleton } from "@/components/admin/franchise-dashboard/franchise-dashboard-skeleton"
import { auth } from "@/lib/auth"

async function FranchiseData() {
  // For demo purposes, using a fixed franchise ID
  // In real implementation, this could come from user session or context

  const session = await auth()
  const franchiseId = session?.franchiseId
  
  console.log("franchise id of user ==> ", franchiseId)
  const result = await getFranchiseById(franchiseId)

  // Enhanced dummy data based on your schema
  const franchise = result.data.data

  return <FranchiseDashboard franchise={franchise} />;
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
