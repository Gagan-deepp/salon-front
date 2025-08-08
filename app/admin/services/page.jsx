import { Suspense } from "react"
import { getServices } from "@/lib/actions/service_action"
import { ServiceTable } from "@/components/admin/service/service-table"
import { CreateServiceDialog } from "@/components/admin/service/create-service-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"

async function ServiceList({ searchParams }) {

  const searchP = await searchParams
  const result = await getServices({
    page: searchP.page || 1,
    limit: searchP.limit || 10,
    search: searchP.search || "",
    category: searchP.category || "",
    role: searchP.role || "",
  })

  console.log("\n\Services result ===> ", result.data.data)

  const services = result.data.data

  return <ServiceTable services={services} />;
}

export default function ServicesPage({ searchParams }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ">Services</h1>
          <p className="text-gray-600">Manage your beauty and wellness services</p>
        </div>
        <CreateServiceDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CreateServiceDialog>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ServiceList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
