import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServiceById } from "@/lib/actions/service_action"
import { ServiceDetails } from "@/components/admin/service/service-details"
import { ServiceDetailsSkeleton } from "@/components/admin/service/service-details-skeleton"

async function ServiceData({ id }) {
  const result = await getServiceById(id)

  // Use dummy data for preview
  const service = result.success
    ? result.data
    : {
        _id: id,
        name: "Hair Cut & Style",
        category: "HAIR_CUT",
        description: "Professional hair cutting and styling service with consultation and finishing touches",
        duration: 45,
        price: 500,
        gstRate: 18,
        isActive: true,
        allowedRoles: ["STYLIST"],
        commissionRate: 15,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T15:45:00Z",
      }

  if (!service) {
    notFound()
  }

  return <ServiceDetails service={service} />;
}

export default function ServicePage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<ServiceDetailsSkeleton />}>
        <ServiceData id={params.id} />
      </Suspense>
    </div>
  );
}
