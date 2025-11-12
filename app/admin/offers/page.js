import { Suspense } from "react"
import { getOffers } from "@/lib/actions/offer_action"
import { OfferTable } from "@/components/admin/offer/offer-table"
import { CreateOfferDialog } from "@/components/admin/offer/create-offer-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { OfferFilter } from "@/components/admin/offer/offer-filter"

export default async function OffersPage({ searchParams }) {
  const searchP = await searchParams
  
  const result = await getOffers({
    page: searchP.page || 1,
    limit: searchP.limit || 10,
    search: searchP.search || "",
    status: searchP.status || "",
    activeOnly: searchP.activeOnly || false,
  })

  console.log("Offers result ===> ", result)

  const offers = result.data?.data?.offers || []
  const pagination = result.data?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Offers & Promo Codes</h1>
          <p className="text-gray-600">Manage promotional offers and discount codes</p>
        </div>
        <CreateOfferDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
        </CreateOfferDialog>
      </div>

      <OfferFilter
        initialSearchTerm={searchP.search || ""}
        initialStatusFilter={searchP.status || "all"}
        initialActiveOnly={searchP.activeOnly === "true"}
      />

      <Suspense fallback={<TableSkeleton />}>
        <OfferTable offers={offers} pagination={pagination} />
      </Suspense>
    </div>
  )
}
