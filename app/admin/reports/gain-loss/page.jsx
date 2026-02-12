import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getGainLoss } from "@/lib/actions/reports.action"
import { Users, UserCheck, Percent, TrendingUp, TrendingDown } from "lucide-react"
import GainLossFilters from "@/components/reports/gain-loss.filter"
import { GainLossTable } from "@/components/report-table-gain-loss"

export default async function GainLossPage({ searchParams }) {
    const session = await auth()
    const franchiseId = session?.franchiseId

    // Get filter params
    const analysisPeriodStart = searchParams?.analysisPeriodStart || "2025-01-01"
    const analysisPeriodEnd = searchParams?.analysisPeriodEnd || "2025-10-31"
    const basePeriodStart = searchParams?.basePeriodStart || "2024-01-01"
    const basePeriodEnd = searchParams?.basePeriodEnd || "2024-10-31"

    // Fetch data
    const result = await getGainLoss(
        franchiseId,
        analysisPeriodStart,
        analysisPeriodEnd,
        basePeriodStart,
        basePeriodEnd
    )
    const data = result?.success ? result.data : null

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Gain / Loss Analysis</h1>
                    <p className="text-sm text-muted-foreground">
                        Compare service-level revenue changes for fixed customer cohort
                    </p>
                </div>
            </div>

            {/* Filters */}
            <GainLossFilters />

            {/* Period Labels */}
            {data?.analysisPeriod && data?.basePeriod && (
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Analysis Period:</span>
                        <Badge variant="default">{data.analysisPeriod.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Base Period:</span>
                        <Badge variant="secondary">{data.basePeriod.label}</Badge>
                    </div>
                </div>
            )}

            {/* Cohort Summary Cards */}
            {data?.cohortSummary && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Analysis Period Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("en-IN").format(data.cohortSummary.customersInAnalysisPeriod)}
                            </div>
                            <p className="text-xs text-muted-foreground">Total customers who transacted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Retained Customers (Cohort)</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("en-IN").format(data.cohortSummary.customersInBothPeriods)}
                            </div>
                            <p className="text-xs text-muted-foreground">Present in both periods</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cohort Retention Rate</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.cohortSummary.cohortRetentionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                {data.cohortSummary.customersInBothPeriods} of {data.cohortSummary.customersInAnalysisPeriod} customers retained
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Total Gain/Loss Summary */}
            {data?.total && (
                <Card className={`border-2 ${data.total.netChange === "Net Loss" ? "border-red-300 bg-red-50" : "border-emerald-300 bg-emerald-50"}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {data.total.netChange === "Net Loss" ? (
                                <TrendingDown className="h-5 w-5 text-red-500" />
                            ) : (
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            )}
                            <span>Total {data.total.netChange}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Base Period Value:</span>
                            <span className="text-lg font-bold">₹{new Intl.NumberFormat("en-IN").format(data.total.baseValue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Analysis Period Value:</span>
                            <span className="text-lg font-bold">₹{new Intl.NumberFormat("en-IN").format(data.total.analysisValue)}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Net Change:</span>
                                <span className={`text-xl font-bold ${data.total.gainLoss > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                    {data.total.gainLoss > 0 ? "+" : ""}₹{new Intl.NumberFormat("en-IN").format(data.total.gainLoss)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm font-medium">Percentage Change:</span>
                                <span className={`text-lg font-bold ${data.total.percentageChange > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                    {data.total.percentageChange > 0 ? "+" : ""}{data.total.percentageChange}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gain/Loss Table */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Gain / Loss Table (Service-Level)</h2>
                    <p className="text-sm text-muted-foreground">
                        Gain / Loss by Service – Fixed Customer Cohort
                    </p>
                </div>
                <GainLossTable data={data} />
            </div>
        </div>
    )
}
