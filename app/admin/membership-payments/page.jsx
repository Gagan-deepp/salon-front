import { MemberPaymentFilters } from "@/components/admin/payment/member-payment-filter"
import { PaymentTable } from "@/components/admin/payment/payment-table"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllMemberPayments, getFranchiseMembershipPayments } from "@/lib/actions/payment_action"
import { auth } from "@/lib/auth"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"


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
            <MemberPaymentFilters />

            {/* Payments Table */}
            <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton />}>
                <PaymentTableWrapper
                    params={params}
                    user={user}
                />
            </Suspense>

        </div>
    )
}



const PaymentTableWrapper = async ({ params, user }) => {

    const result = user.role === "SUPER_ADMIN" ? await getAllMemberPayments(params) : await getFranchiseMembershipPayments(params)

    // console.log("result payments", result)
    // console.debug("Payment Data Result ==> ", result.data.data)
    const payments = result.success ? result.data.data || [] : []
    const pagination = result.success ? result.data.pagination || {} : {}
    const total = result.success ? result.data.data.length || 0 : 0
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<TableSkeleton />}>
                    <PaymentTable payments={payments}
                        pagination={
                            {
                                page: params.page ? parseInt(params.page) : 1,
                                limit: params.limit ? parseInt(params.limit) : 10,
                                totalPages: pagination.totalPages || 0,
                            }
                        }
                        total={total} />
                </Suspense>
            </CardContent>
        </Card>
    )
}