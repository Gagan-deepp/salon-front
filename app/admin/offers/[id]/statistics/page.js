import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getOfferStatistics, getOffer } from "@/lib/actions/offer_action"
import { OfferStatistics } from "@/components/admin/offer/offer-statistics"
import { OfferDetailsSkeleton } from "@/components/admin/offer/offer-details-skeleton"

async function StatisticsData({ id }) {
  try {
    console.log("📊 Loading statistics for offer:", id)

    const [offerResult, statsResult] = await Promise.all([
      getOffer(id),
      getOfferStatistics(id)
    ])

    console.log("📈 Offer result:", offerResult)
    console.log("📉 Statistics result:", statsResult)
    
    if (!offerResult.success || !statsResult.success) {
      console.log("❌ Failed to load statistics")
      notFound()
    }

    console.log("✅ Statistics loaded")
    return (
      <OfferStatistics
        offer={offerResult.data.data}
        statistics={statsResult.data.data}
      />
    )
  } catch (error) {
    console.error("❌ Error loading statistics:", error)
    notFound()
  }
}

// Await params in Next.js 15
export default async function OfferStatisticsPage({ params }) {
  const { id } = await params

  return (
    <div className="p-6">
      <Suspense fallback={<OfferDetailsSkeleton />}>
        <StatisticsData id={id} />
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
        title: `${offer.offerCode} - Statistics`,
        description: `View performance statistics for ${offer.name}`
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Offer Statistics",
    description: "View offer performance metrics"
  }
}
