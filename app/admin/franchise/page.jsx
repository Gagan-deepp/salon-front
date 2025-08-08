import { Suspense } from "react"
import { getFranchiseById } from "@/lib/actions/franchise_action"
import { FranchiseDashboard } from "@/components/admin/franchise-dashboard/franchise-dashboard"
import { FranchiseDashboardSkeleton } from "@/components/admin/franchise-dashboard/franchise-dashboard-skeleton"

async function FranchiseData() {
  // For demo purposes, using a fixed franchise ID
  // In real implementation, this could come from user session or context
  const franchiseId = "507f1f77bcf86cd799439011"
  
  const result = await getFranchiseById(franchiseId)

  // Enhanced dummy data based on your schema
  const franchise = result.success
    ? result.data
    : {
        _id: franchiseId,
        name: "Downtown Beauty Hub",
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
          email: "downtown@beautyhub.com",
          whatsapp: "+91 9876543210",
        },
        gstNumber: "27ABCDE1234F1Z5",
        ownerId: "507f1f77bcf86cd799439012",
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
          printerSettings: {
            receiptHeader: "Downtown Beauty Hub",
            receiptFooter: "Thank you for visiting!",
            logoUrl: "/logo.png",
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
          totalSales: 485000,
          totalCustomers: 1250,
          averageBillValue: 388,
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-12-15T15:45:00Z",
      }

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
