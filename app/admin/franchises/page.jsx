import { Suspense } from "react"
import { getFranchises } from "@/lib/actions/franchise_action"
import { FranchiseTable } from "@/components/admin/franchise/franchise-table"
import { CreateFranchiseDialog } from "@/components/admin/franchise/create-franchise-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"

async function FranchiseList({ searchParams }) {
  const result = await getFranchises({
    page: searchParams.page || 1,
    limit: searchParams.limit || 10,
    q: searchParams.q || "",
    sort: searchParams.sort || "createdAt",
  })

  console.log("\n\nFranchise result ===> ", result.data.data)

  const franchises = result.data.data


  return <FranchiseTable franchises={franchises} />;
}

export default function FranchisesPage({ searchParams }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Franchises</h1>
          <p className="text-gray-600">Manage your franchise locations</p>
        </div>
        <CreateFranchiseDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Franchise
          </Button>
        </CreateFranchiseDialog>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <FranchiseList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
