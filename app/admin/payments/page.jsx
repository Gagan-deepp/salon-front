import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, CreditCard, TrendingUp, Users } from "lucide-react"
import { PaymentTable } from "@/components/admin/payment/payment-table"
import { getAllPayments, getCashierPayments, getFranchisePayments, getPaymentAnalyticsSummary } from "@/lib/actions/payment_action"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import Link from "next/link"
import { PaymentFilters } from "@/components/admin/payment/payment-filter"
import { auth } from "@/lib/auth"


export default async function PaymentsPage({ searchParams }) {

  const searchP = await searchParams
  const { user } = await auth()

  const params = {
    page: Number.parseInt(searchP.page) || 1,
    limit: 10,
    search: searchP.search || "",
    status: searchP.status || "",
    paymentMode: searchP.paymentMode || "",
    startDate: searchP.startDate || "",
    endDate: searchP.endDate || "",
  }

  const result = user.role === "SUPER_ADMIN" ? await getAllPayments(params) : user.role === "CASHIER" ? await getCashierPayments(params, user.id) : await getFranchisePayments(params)

  console.debug("Payment Data Result ==> ", result.data.data)
  const payments = result.success ? result.data.data || [] : []
  const pagination = result.success ? result.data.pagination || {} : {}
  const total = result.success ? result.data.data.length || 0 : 0

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage and track all payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/create/payment">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Payment
            </Button>
          </Link>
        </div>
      </div>


      {/* Filters */}
      <PaymentFilters />

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <PaymentTable payments={payments}
              pagination={
                {
                  page: searchP.page ? parseInt(searchP.page) : 1,
                  limit: searchP.limit ? parseInt(searchP.limit) : 10,
                  total: pagination.total || 0,
                  totalPages: pagination.totalPages || 0,
                }
              }
              total={total} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
