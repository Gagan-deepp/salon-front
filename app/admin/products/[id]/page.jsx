import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/actions/product_action"
import { ProductDetails } from "@/components/admin/product/product-details"
import { ProductDetailsSkeleton } from "@/components/admin/product/product-details-skeleton"

async function ProductData({ id }) {
  const result = await getProductById(id)

  // Use dummy data for preview
  const product = result.success
    ? result.data
    : {
        _id: id,
        name: "Premium Hair Serum",
        category: "HAIR_CARE",
        brand: "BeautyPro",
        description:
          "Advanced hair serum with natural ingredients for healthy, shiny hair. Suitable for all hair types.",
        sku: "BP-HS-001",
        price: { mrp: 1200, selling: 999, cost: 600 },
        gstRate: 18,
        stock: { current: 25, minimum: 10, maximum: 100 },
        isActive: true,
        commissionRate: 8,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T15:45:00Z",
      }

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />;
}

export default function ProductPage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductData id={params.id} />
      </Suspense>
    </div>
  );
}
