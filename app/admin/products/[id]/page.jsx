import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/actions/product_action"
import { ProductDetails } from "@/components/admin/product/product-details"
import { ProductDetailsSkeleton } from "@/components/admin/product/product-details-skeleton"

async function ProductData({ id }) {
  const result = await getProductById(id)

  console.log("\n\n Specific Product result ===> ", result.data.data)

  const product = result.data.data

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />;
}

export default async function ProductPage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductData id={(await params).id} />
      </Suspense>
    </div>
  );
}
