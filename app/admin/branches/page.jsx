import { CreateFranchiseDialog } from "@/components/admin/franchise/create-franchise-dialog"
import { FranchiseTable } from "@/components/admin/franchise/franchise-table"
import { Button } from "@/components/ui/button"
import { getFranchises } from "@/lib/actions/franchise_action"
import { auth } from "@/lib/auth"
import { Plus } from "lucide-react"


export default async function FranchisesPage({ searchParams }) {

  const searchP = await searchParams;
  const session = await auth()
  const result = await getFranchises({
    page: searchP.page || 1,
    limit: searchP.limit || 10,
    q: searchP.q || "",
    sort: searchP.sort || "createdAt",
  })

  console.log("\n\nFranchise result ===> ", result.data.data)

  const franchises = result.data.data

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ">Franchises</h1>
          <p className="text-gray-600">Manage your franchise locations</p>
        </div>
        <CreateFranchiseDialog companyId={session?.companyId}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Franchise
          </Button>
        </CreateFranchiseDialog>
      </div>
      <FranchiseTable franchises={franchises} />
    </div>
  );
}
