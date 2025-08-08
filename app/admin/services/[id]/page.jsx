import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServiceById } from "@/lib/actions/service_action"
import { ServiceDetails } from "@/components/admin/service/service-details"
import { ServiceDetailsSkeleton } from "@/components/admin/service/service-details-skeleton"

async function ServiceData({ id }) {
  const result = await getServiceById(id)

  console.log("\n\n Specific service result ===> ", result.data.data)

  const service = result.data.data

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
