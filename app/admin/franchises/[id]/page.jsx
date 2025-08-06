import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDetails } from "@/components/admin/franchise/franchise-details"
import { FranchiseDetailsSkeleton } from "@/components/admin/franchise/franchise-details-skeleton"

async function FranchiseData({ id }) {
  const result = await getFranchiseById(id)

  // Use dummy data for preview
  const franchise = result.success
    ? result.data
    : {
        _id: id,
        name: "Downtown Branch",
        code: "DOW1234",
        address: {
          street: "123 Main Street, Commercial Complex",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
        },
        contact: {
          phone: "+91 9876543210",
          email: "downtown@franchise.com",
          whatsapp: "+91 9876543210",
        },
        gstNumber: "27ABCDE1234F1Z5",
        isActive: true,
        settings: {
          gstEnabled: true,
          loyaltyProgram: {
            enabled: true,
            pointsPerRupee: 1,
            redemptionRate: 1,
          },
          discountLimits: {
            maxPercentage: 20,
            requireApproval: 15,
          },
          paymentMethods: {
            cash: true,
            card: true,
            upi: true,
            wallet: true,
          },
        },
        subscription: {
          plan: "PREMIUM",
          startDate: "2024-01-15T00:00:00Z",
          endDate: "2025-01-15T00:00:00Z",
          isActive: true,
        },
        analytics: {
          totalSales: 125000,
          totalCustomers: 450,
          averageBillValue: 278,
        },
        createdAt: "2024-01-15T10:30:00Z",
      }

  if (!franchise) {
    notFound()
  }

  return <FranchiseDetails franchise={franchise} />;
}

export default function FranchisePage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<FranchiseDetailsSkeleton />}>
        <FranchiseData id={params.id} />
      </Suspense>
    </div>
  );
}
