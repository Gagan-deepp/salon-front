import { Suspense } from "react"
import { getServices } from "@/lib/actions/service_action"
import { ServiceTable } from "@/components/admin/service/service-table"
import { CreateServiceDialog } from "@/components/admin/service/create-service-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"

async function ServiceList({ searchParams }) {
  const result = await getServices({
    page: searchParams.page || 1,
    limit: searchParams.limit || 10,
    search: searchParams.search || "",
    category: searchParams.category || "",
    role: searchParams.role || "",
  })

  // Use dummy data for preview
  const services = result.success
    ? result.data.services || result.data
    : [
        {
          _id: "1",
          name: "Hair Cut & Style",
          category: "HAIR_CUT",
          description: "Professional hair cutting and styling service",
          duration: 45,
          price: 500,
          gstRate: 18,
          isActive: true,
          allowedRoles: ["STYLIST"],
          commissionRate: 15,
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "2",
          name: "Deep Cleansing Facial",
          category: "FACIAL",
          description: "Rejuvenating facial treatment for all skin types",
          duration: 90,
          price: 1200,
          gstRate: 18,
          isActive: true,
          allowedRoles: ["THERAPIST"],
          commissionRate: 20,
          createdAt: "2024-02-20T14:15:00Z",
        },
        {
          _id: "3",
          name: "Full Body Massage",
          category: "MASSAGE",
          description: "Relaxing full body massage therapy",
          duration: 60,
          price: 1500,
          gstRate: 18,
          isActive: false,
          allowedRoles: ["THERAPIST", "MANAGER"],
          commissionRate: 25,
          createdAt: "2024-03-10T09:45:00Z",
        },
        {
          _id: "4",
          name: "Bridal Makeup",
          category: "BRIDAL",
          description: "Complete bridal makeup package",
          duration: 120,
          price: 3500,
          gstRate: 18,
          isActive: true,
          allowedRoles: ["STYLIST", "MANAGER"],
          commissionRate: 30,
          createdAt: "2024-03-15T11:20:00Z",
        },
      ]

  return <ServiceTable services={services} />;
}

export default function ServicesPage({ searchParams }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
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
