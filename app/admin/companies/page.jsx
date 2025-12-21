import { Suspense } from "react"
import { getCompanies } from "@/lib/actions/company_action"
import { CompanyTable } from "@/components/admin/company/company-table"
import { CreateCompanyDialog } from "@/components/admin/company/create-company-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { CompanyFilter } from "@/components/admin/company/company-filter"

export default async function CompaniesPage({ searchParams }) {
  const searchP = await searchParams
  const result = await getCompanies({
    page: searchP.page || 1,
    limit: searchP.limit || 10,
    search: searchP.search || "",
    status: searchP.status || "",
    plan: searchP.plan || "",
  })
  console.log("compnaies",result)

  console.log("\nCompanies result ===> ", result.data.companies)

  const companies = result.data.data.companies

  console.log("companies that we are passing",companies)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-600">Manage your onboarded salon companies</p>
        </div>
        <CreateCompanyDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </CreateCompanyDialog>
      </div>

      <CompanyFilter
        initialSearchTerm={searchP.search || ""}
        initialStatusFilter={searchP.status || "all"}
        initialPlanFilter={searchP.plan || "all"}
      />

      <Suspense fallback={<TableSkeleton />}>
        <CompanyTable companies={companies} />
      </Suspense>
    </div>
  );
}
