import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomerPurchase } from "@/lib/actions/reports.action"
import { Scissors, Sparkles, Hand, Paintbrush, Wind, User } from "lucide-react"
import CustomerPurchaseFilters from "@/components/reports/customer-purchase.filter"
import { CustomerPurchaseTable } from "@/components/report-table-purchase"

export default async function CustomerPurchasePage({ searchParams }) {
    const session = await auth()
    const franchiseId = session?.franchiseId

    // Get filter params
    const startDate = searchParams?.startDate || "2024-11-01"
    const endDate = searchParams?.endDate || "2025-10-31"
    const customerType = searchParams?.customerType || "Total"

    // Fetch data
    const result = await getCustomerPurchase(franchiseId, startDate, endDate, customerType)
    const data = result?.success ? result.data : null

    // Calculate total purchase value and avg ticket across all categories
    let totalPurchaseValue = 0
    let totalTransactions = 0
    const categorySummary = {}

    if (data?.categories) {
        Object.keys(data.categories).forEach(category => {
            const categoryData = data.categories[category]
            const categoryTotal = categoryData.reduce((sum, month) => sum + month.purchaseValue, 0)
            const categoryTransactions = categoryData.reduce((sum, month) => sum + month.transactionCount, 0)
            const categoryAvgTicket = categoryTransactions > 0 ? categoryTotal / categoryTransactions : 0

            totalPurchaseValue += categoryTotal
            totalTransactions += categoryTransactions

            categorySummary[category] = {
                purchaseValue: categoryTotal,
                transactions: categoryTransactions,
                avgTicket: categoryAvgTicket
            }
        })
    }

    const overallAvgTicket = totalTransactions > 0 ? totalPurchaseValue / totalTransactions : 0

    // Category icons mapping
    const categoryIcons = {
        Hair: Scissors,
        Skin: Sparkles,
        Nails: Hand,
        Makeup: Paintbrush,
        Spa: Wind,
        Body_Care: User,
        Others: User,
        "Make up": Paintbrush
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customer Purchase Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Track purchase value and average ticket size by service category
                    </p>
                </div>
                <Badge variant="outline" className="text-sm">
                    FY 2024-25
                </Badge>
            </div>

            {/* Filters */}
            <CustomerPurchaseFilters />

            {/* Summary Cards - Overall */}
            <div className="grid gap-4 md:grid-cols-3 max-w-344">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{new Intl.NumberFormat("en-IN").format(totalPurchaseValue)}</div>
                        <p className="text-xs text-muted-foreground">All categories combined</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat("en-IN").format(totalTransactions)}</div>
                        <p className="text-xs text-muted-foreground">Across all categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Avg Ticket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{new Intl.NumberFormat("en-IN").format(Math.round(overallAvgTicket))}</div>
                        <p className="text-xs text-muted-foreground">Average per transaction</p>
                    </CardContent>
                </Card>
            </div>

            {/* Category Summary Cards */}
            {data?.categories && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-344" >
                    {Object.keys(categorySummary).map((category) => {
                        const Icon = categoryIcons[category] || User
                        const summary = categorySummary[category]

                        return (
                            <Card key={category}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{category}</CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold">₹{new Intl.NumberFormat("en-IN").format(summary.purchaseValue)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Avg Ticket: ₹{new Intl.NumberFormat("en-IN").format(Math.round(summary.avgTicket))}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {summary.transactions} transactions
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Purchase Value & Avg Ticket Table */}
            <div className="space-y-4 max-w-344">
                <div>
                    <h2 className="text-xl font-semibold">Customer Purchase - By Category</h2>
                    <p className="text-sm text-muted-foreground">
                        Monthly purchase value and average ticket size for {customerType.toLowerCase()} customers
                    </p>
                </div>
                <CustomerPurchaseTable data={data} />
            </div>
        </div>
    )
}
