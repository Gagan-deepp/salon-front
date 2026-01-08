import { Suspense } from "react"
import { getServices } from "@/lib/actions/service_action"
import { ServiceTable } from "@/components/admin/service/service-table"
import { CreateServiceDialog } from "@/components/admin/service/create-service-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { ServiceFilter } from "@/components/admin/service/service-filter"
import { auth } from "@/lib/auth"


export default async function ServicesPage({ searchParams }) {

  const searchP = await searchParams
  const { user } = await auth()
  const result = await getServices({
    page: searchP.page || 1,
    limit: searchP.limit || 30,
    search: searchP.search || "",
    category: searchP.category || "",
    role: searchP.role || "",
  })

  // console.log("\n\Services result ===> ", result.data)

  const services = result?.data?.data || []
  const pagination = result?.data?.pagination || {}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ">Services</h1>
          <p className="text-gray-600">Manage your beauty and wellness services</p>
        </div>
        {(user?.role === "SUPER_ADMIN" || user?.role === "SAAS_OWNER") && <CreateServiceDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CreateServiceDialog>}
      </div>

      <ServiceFilter
        initialSearchTerm={searchP.search || ""}
        initialCategoryFilter={searchP.category || "all"}
        initialRoleFilter={searchP.role || "all"}
      />

      <Suspense fallback={<TableSkeleton />}>
        <ServiceTable
          services={services}
          pagination={
            {
              page: searchP.page ? parseInt(searchP.page) : 1,
              limit: searchP.limit ? parseInt(searchP.limit) : 10,
              total: pagination.total || 0,
              totalPages: pagination.totalPages || 0,
            }
          }
        />
      </Suspense>
    </div>
  );
}
