import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRepeatCustomer } from "@/lib/actions/analytics_action"
import { Users, IndianRupee, Repeat, BookOpen } from "lucide-react"
import { format } from "date-fns"
import { Suspense } from "react"
import { SummaryCardsSkeleton, TableContainerSkeleton } from "@/components/admin/report-skeletons"
import RepeatCustomerFilters from "@/components/reports/repeat-customer.filter"


export default async function RepeatCustomerPage({ searchParams }) {
    const searchP = await searchParams

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Repeat Customers</h1>
                    <p className="text-sm text-muted-foreground">
                        Top repeated customers and their visit history
                    </p>
                </div>
            </div>

            {/* Filters */}
            <RepeatCustomerFilters />

            <Suspense
                key={`${searchP?.startDate || ''}-${searchP?.endDate || ''}`}
                fallback={
                    <>
                        <SummaryCardsSkeleton />
                        <div className="space-y-4">
                            <TableContainerSkeleton />
                        </div>
                    </>
                }
            >
                <RepeatCustomerData
                    startDate={searchP?.startDate}
                    endDate={searchP?.endDate}
                />
            </Suspense>
        </div>
    );
}

async function RepeatCustomerData({ startDate, endDate }) {
    const result = await getRepeatCustomer(startDate, endDate)

    if (!result.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No repeat customer data found.</p>
                </CardContent>
            </Card>
        );
    }

    const repeat_customer = result.data

    const totalCustomers = repeat_customer?.length || 0
    const totalSpentAll = repeat_customer?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 0
    const totalVisitsAll = repeat_customer?.reduce((sum, c) => sum + (c.totalVisits || 0), 0) || 0

    return (
        <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">Customers with multiple visits</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            ₹{new Intl.NumberFormat("en-IN").format(totalSpentAll)}
                        </div>
                        <p className="text-xs text-muted-foreground">From repeat customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <Repeat className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalVisitsAll}</div>
                        <p className="text-xs text-muted-foreground">Combined visits across all repeat customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Repeat Customer List</h2>
                    <p className="text-sm text-muted-foreground">
                        Detailed breakdown of repeat customer activity
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-md border overflow-auto">
                        <Table>
                            <TableHeader className="bg-primary">
                                <TableRow>
                                    <TableHead className="text-white font-bold min-w-[150px]">Customer Name</TableHead>
                                    <TableHead className="text-white min-w-[120px]">Phone</TableHead>
                                    <TableHead className="text-white text-center min-w-[100px]">Total Visits</TableHead>
                                    <TableHead className="text-white text-center min-w-[130px]">Total Spent (Rs.)</TableHead>
                                    <TableHead className="text-white text-center min-w-[130px]">First Visit</TableHead>
                                    <TableHead className="text-white text-center min-w-[130px]">Last Visit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {repeat_customer.map((customer, index) => (
                                    <TableRow
                                        key={customer._id}
                                        className={index % 2 === 0 ? "bg-muted" : "bg-gray-300"}>
                                        <TableCell className="font-semibold">{customer.customerName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-white/50">{customer.customerPhone}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">
                                            {customer.totalVisits}
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-emerald-600">
                                            ₹{new Intl.NumberFormat("en-IN").format(customer.totalSpent || 0)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {customer.firstVisit ? format(new Date(customer.firstVisit), "PPP") : "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {customer.lastVisit ? format(new Date(customer.lastVisit), "PPP") : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* Total Row */}
                                <TableRow className="bg-primary font-bold hover:bg-primary">
                                    <TableCell className="text-white">Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-white text-center">{totalVisitsAll}</TableCell>
                                    <TableCell className="text-white text-center text-lg">
                                        ₹{new Intl.NumberFormat("en-IN").format(totalSpentAll)}
                                    </TableCell>
                                    <TableCell colSpan={2}></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* How to Read This Section */}
                    <div className="rounded-lg border bg-muted/50 p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <BookOpen /> How to Read This
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="font-bold mt-0.5 text-emerald-600">▲</span>
                                <span><strong>Total Spent:</strong> Higher values indicate high-value loyal customers worth retaining</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold mt-0.5">→</span>
                                <span><strong>Total Visits:</strong> Frequency of visits helps identify your most engaged customers</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold mt-0.5">-</span>
                                <span>Compare <strong>First Visit</strong> and <strong>Last Visit</strong> to understand customer lifecycle duration</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
