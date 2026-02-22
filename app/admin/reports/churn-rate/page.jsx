import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getChurnRate } from "@/lib/actions/analytics_action"
import { Users, UserMinus, Percent } from "lucide-react"
import { ChurnRateTable } from "@/components/report-table-churn-rate"

export default async function ChurnRatePage() {
    const result = await getChurnRate()

    if (!result?.success) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">No churn rate data found or error fetching data.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const churnData = result.data
    const churnPercentage = churnData.totalCustomers > 0
        ? ((churnData.churnCount / churnData.totalCustomers) * 100).toFixed(1)
        : 0

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Churn Rate Analysis</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of customer retention and lost customers for {churnData.franchiseName || 'Franchise'}
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("en-IN").format(churnData.totalCustomers)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total customer base</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Churned Customers</CardTitle>
                        <UserMinus className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {new Intl.NumberFormat("en-IN").format(churnData.churnCount)}
                        </div>
                        <p className="text-xs text-muted-foreground">Customers lost</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${Number(churnPercentage) > 20 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {churnPercentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Percentage of customer base churned
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Churn Table */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Churned Customers List</h2>
                    <p className="text-sm text-muted-foreground">
                        Detailed list of customers who are at risk or have churned
                    </p>
                </div>
                <ChurnRateTable data={churnData} />
            </div>
        </div>
    );
}
