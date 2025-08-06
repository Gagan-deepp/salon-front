import { Suspense } from "react"
import { getProducts } from "@/lib/actions/product_action"
import { ProductTable } from "@/components/admin/product/product-table"
import { CreateProductDialog } from "@/components/admin/product/create-product-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TableSkeleton } from "@/components/admin/table-skeleton"

async function ProductList({ searchParams }) {
  const params = (await searchParams)
  const result = await getProducts({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search || "",
    category: params.category || "",
    lowStock: params.lowStock || "",
  })

  // Use dummy data for preview
  console.log("Products result ==> ", result)
  const products = result.success
    ? result.data.products || result.data
    : [
      {
        _id: "1",
        name: "Premium Hair Serum",
        category: "HAIR_CARE",
        brand: "BeautyPro",
        sku: "BP-HS-001",
        price: { mrp: 1200, selling: 999, cost: 600 },
        gstRate: 18,
        stock: { current: 25, minimum: 10, maximum: 100 },
        isActive: true,
        commissionRate: 8,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: "2",
        name: "Moisturizing Face Cream",
        category: "SKIN_CARE",
        brand: "GlowUp",
        sku: "GU-FC-002",
        price: { mrp: 800, selling: 650, cost: 400 },
        gstRate: 18,
        stock: { current: 5, minimum: 10, maximum: 50 },
        isActive: true,
        commissionRate: 10,
        createdAt: "2024-02-20T14:15:00Z",
      },
      {
        _id: "3",
        name: "Lipstick Matte Finish",
        category: "MAKEUP",
        brand: "ColorMagic",
        sku: "CM-LS-003",
        price: { mrp: 450, selling: 399, cost: 200 },
        gstRate: 18,
        stock: { current: 45, minimum: 15, maximum: 80 },
        isActive: false,
        commissionRate: 12,
        createdAt: "2024-03-10T09:45:00Z",
      },
    ]

  return <ProductTable products={products} />;
}

export default function ProductsPage({ searchParams }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <CreateProductDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CreateProductDialog>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
