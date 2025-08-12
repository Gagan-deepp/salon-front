import { notFound } from "next/navigation"
import { getPaymentById } from "@/lib/actions/payment_action"
import { PaymentDetails } from "@/components/admin/payment/payment-details"
import { PaymentDetailsSkeleton } from "@/components/admin/payment/payment-details-skeleton"
import { Suspense } from "react"

export default async function PaymentDetailsPage({ params }) {
  const result = await getPaymentById((await params).id)

  if (!result || !result.success) {
    notFound()
  }

  console.log("Specific payment data ==> ", result.data.data)

  const payment = result.data.data

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<PaymentDetailsSkeleton />}>
        <PaymentDetails payment={payment} />
      </Suspense>
    </div>
  )
}
