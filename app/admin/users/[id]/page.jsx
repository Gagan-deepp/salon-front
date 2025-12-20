import { Suspense } from "react"
import { UserDetails } from "@/components/admin/user/user-details"
import { UserDetailsSkeleton } from "@/components/admin/user/user-details-skeleton"
import { getUserById, getUserPerformance, getUserReferrals } from "@/lib/actions/user_action"
import { notFound } from "next/navigation"

async function UserData({ userId }) {
  try {
    const result = await getUserById(userId)

    if (!result.success || !result.data) {
      notFound()
    }

    const user = result.data.data
    let performance = null
    let referrals = []

    if (user.role === "CASHIER") {
      const perfResult = await getUserPerformance(userId, {})
      if (perfResult.success) {
        performance = perfResult.data
      }

      const refResult = await getUserReferrals(userId, { limit: 5 })
      if (refResult.success) {
        referrals = refResult.data.referrals || []
      }
    }

    return <UserDetails user={user} performance={performance} referrals={referrals} />
  } catch (error) {
    console.error("Error fetching user details:", error)
    notFound()
  }
}

export default async function UserDetailsPage({ params }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<UserDetailsSkeleton />}>
        <UserData userId={(await params).id} />
      </Suspense>
    </div>
  )
}
