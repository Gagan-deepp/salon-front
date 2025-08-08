import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCustomerById } from "@/lib/actions/customer_action"
import { CustomerDetails } from "@/components/admin/customer/customer-details"
import { CustomerDetailsSkeleton } from "@/components/admin/customer/customer-details-skeleton"

async function CustomerData({ id }) {
  const result = await getCustomerById(id)

  // Use dummy data for preview
  const customer = result.success
    ? result.data
    : {
        _id: id,
        name: "Priya Sharma",
        phone: "+91 9876543210",
        email: "priya.sharma@email.com",
        gender: "FEMALE",
        dateOfBirth: "1992-05-15T00:00:00Z",
        address: {
          street: "123 MG Road, Commercial Complex",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
        franchiseId: "507f1f77bcf86cd799439011",
        referredBy: {
          employeeId: "507f1f77bcf86cd799439020",
        },
        loyaltyPoints: {
          total: 1250,
          available: 850,
          redeemed: 400,
        },
        visitHistory: {
          totalVisits: 12,
          lastVisit: "2024-01-10T14:30:00Z",
          firstVisit: "2023-06-15T10:00:00Z",
          totalSpent: 15600,
        },
        preferences: {
          preferredServices: ["507f1f77bcf86cd799439030", "507f1f77bcf86cd799439031"],
          preferredStaff: ["507f1f77bcf86cd799439040"],
          notes: "Prefers appointments in the afternoon. Allergic to certain hair products.",
        },
        isActive: true,
        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2024-01-10T14:30:00Z",
      }

  if (!customer) {
    notFound()
  }

  return <CustomerDetails customer={customer} />;
}

export default function CustomerPage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<CustomerDetailsSkeleton />}>
        <CustomerData id={params.id} />
      </Suspense>
    </div>
  );
}
