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

async function PaymentAnalytics() {
  const result = await getPaymentAnalyticsSummary({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  })

  console.debug("Payment Analytics Result:", result.data)

  const analytics = result.data.data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{analytics.totalRevenue?.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalPayments || 0}</div>
          <p className="text-xs text-muted-foreground">Completed transactions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Bill</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{analytics.averageBill?.toFixed(2) || 0}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.uniqueCustomers || 0}</div>
          <p className="text-xs text-muted-foreground">Active customers</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function PaymentsPage({ searchParams }) {

  const searchP = await searchParams
  const { user } = await auth()

  const params = {
    page: Number.parseInt(searchP.page) || 1,
    limit: 10,
    search: searchP.search || "",
    status: searchP.status || "",
    paymentMode: searchP.paymentMode || "",
  }

  const result = user.role === "SUPER_ADMIN" ? await getAllPayments(params) : user.role === "CASHIER" ? await getCashierPayments(params, user.id) : await getFranchisePayments(params)

  console.debug("Payment Data Result ==> ", result.data.data)
  const payments = result.success ? result.data.data || [] : []
  const total = result.success ? result.data.data.length || 0 : 0
  const totalPages = Math.ceil(total / 10)

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

      {/* Analytics Cards */}
      {/* <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <PaymentAnalytics />
      </Suspense> */}

      {/* Filters */}
      <PaymentFilters />

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <PaymentTable payments={payments} currentPage={params.page} totalPages={totalPages} total={total} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
