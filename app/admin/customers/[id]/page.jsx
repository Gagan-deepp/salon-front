import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCustomerById } from "@/lib/actions/customer_action"
import { CustomerDetails } from "@/components/admin/customer/customer-details"
import { CustomerDetailsSkeleton } from "@/components/admin/customer/customer-details-skeleton"

async function CustomerData({ id }) {
  const result = await getCustomerById(id)

  const customer = result.data.data
  console.debug("Specific customer data ==> ", customer)

  if (!customer) {
    notFound()
  }

  return <CustomerDetails customer={customer} />;
}

export default function CustomerPage({ params }) {
  return (
    <div className="p-6">
      <Suspense fallback={<CustomerDetailsSkeleton />}>
        <CustomerData id={params.id} />
      </Suspense>
    </div>
  );
}
