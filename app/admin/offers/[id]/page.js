import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getOffer } from "@/lib/actions/offer_action"
import { OfferDetails } from "@/components/admin/offer/offer-details"
import { OfferDetailsSkeleton } from "@/components/admin/offer/offer-details-skeleton"

async function OfferData({ id }) {
  try {
    console.log("🔍 Loading offer:", id)
    const result = await getOffer(id)
    
    if (!result.success || !result.data) {
      console.log("❌ Offer not found")
      notFound()
    }

    const offer = result.data.data
    console.log("✅ Offer loaded:", offer.offerCode)
    return <OfferDetails offer={offer} />
  } catch (error) {
    console.error("❌ Error loading offer:", error)
    notFound()
  }
}

// In Next.js 15, params is a Promise
export default async function OfferPage({ params }) {
  // Await params
  const { id } = await params
  
  return (
    <div className="p-6">
      <Suspense fallback={<OfferDetailsSkeleton />}>
        <OfferData id={id} />
      </Suspense>
    </div>
  )
}

// Optional: Add metadata
export async function generateMetadata({ params }) {
  const { id } = await params
  
  try {
    const result = await getOffer(id)
    
    if (result.success && result.data) {
      const offer = result.data.data
      return {
        title: `${offer.name} - Offer Details`,
        description: offer.description || `View details for ${offer.offerCode}`
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }
  
  return {
    title: "Offer Details",
    description: "View offer information"
  }
}
