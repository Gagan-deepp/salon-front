import { Suspense } from "react"
import { getProducts } from "@/lib/actions/product_action"
import { ProductTable } from "@/components/admin/product/product-table"
import { CreateProductDialog } from "@/components/admin/product/create-product-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { ProductFilter } from "@/components/admin/product/product-filter"
import { auth } from "@/lib/auth"


export default async function ProductsPage({ searchParams }) {

  const searchP = await searchParams
  const { user } = await auth()
  const result = await getProducts({
    page: searchP.page || 1,
    limit: searchP.limit || 30,
    search: searchP.search || "",
    category: searchP.category || "",
    lowStock: searchP.lowStock || "",
  })

  console.log("\n\n Products result ===> ", result.data)

  const products = result.data.data || []
  const pagination = result.data.pagination || {}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold ">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <CreateProductDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CreateProductDialog>
      </div>


      <ProductFilter
        initialSearchTerm={searchP.search || ""}
        initialCategoryFilter={searchP.category || "all"}
      />

      <Suspense fallback={<TableSkeleton />}>
        <ProductTable
          products={products}
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
