import { ConsumableUsageFilters } from '@/components/reports/consumable-filter.filter'
import { Badge } from '@/components/ui/badge'
import { CalendarRange, Package } from 'lucide-react'
import { Suspense } from 'react'
import { SummaryCardsSkeleton, TableContainerSkeleton } from '@/components/admin/report-skeletons'
import { getConsumableUsageReport } from '@/lib/actions/consumable_report'
import { auth } from '@/lib/auth'
import { ConsumableUsageTable } from '@/components/report-table'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'

export default async function ConsumableUsagePage({ searchParams }) {
    const searchP = await searchParams

    return (
        <div className="p-6 w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Consumable Usage Report
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track consumable product usage and costs across all services
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary bg-primary/10 px-3 py-1">
                        <Package className="h-3.5 w-3.5 mr-1.5" />
                        Consumables
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <ConsumableUsageFilters />

            {/* Dynamic Content */}
            <Suspense
                key={`${searchP?.startDate || ''}-${searchP?.endDate || ''}-${searchP?.serviceId || ''}-${searchP?.productId || ''}`}
                fallback={
                    <>
                        <SummaryCardsSkeleton />
                        <TableContainerSkeleton />
                    </>
                }
            >
                <ConsumableUsageData
                    startDate={searchP?.startDate}
                    endDate={searchP?.endDate}
                    serviceId={searchP?.serviceId}
                    productId={searchP?.productId}
                    providerId={searchP?.providerId}
                />
            </Suspense>
        </div>
    )
}

// Data fetching component
async function ConsumableUsageData({ startDate, endDate, serviceId, productId, providerId }) {
    const session = await auth()

    const response = await getConsumableUsageReport({
        franchiseId: session.franchiseId,
        startDate,
        endDate,
        serviceId,
        productId,
        providerId
    })
    console.log("respone ====",response)

    if (!response?.success) {
        return (
            <div className="text-center space-y-2 py-8">
                <p className="text-red-500 font-medium">Failed to load consumable usage data</p>
                <p className="text-sm text-muted-foreground">
                    {response?.error || 'An unexpected error occurred'}
                </p>
            </div>
        )
    }

    const { data } = response
    const { report, summary } = data

    console.log("resport after destructure",report)

    const summaryCards = [
        {
            title: 'Total Items Used',
            value: summary?.totalItems ?? '-',
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'Total Cost',
            value: summary?.totalCost ? `₹${summary.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
            icon: DollarSign,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Total Revenue',
            value: summary?.totalRevenue ? `₹${summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Total Profit',
            value: summary?.totalProfit ? `₹${summary.totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ]

    return (
        <>
            {/* Summary Cards */}
            <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-8">
                {summaryCards.map((card) => (
                    <Card key={card.title} className="shadow-sm border-slate-200">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className={`rounded-lg p-2.5 ${card.bg}`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold tracking-tight text-slate-900">
                                    {card.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                    <h2 className="text-lg font-medium text-slate-900">Consumable Usage by Service & Item</h2>
                    <p className="mt-1 text-sm text-gray-600 font-light">
                        Detailed breakdown of consumable usage, costs, and profitability
                    </p>
                </div>
                <div className="p-6">
                    <ConsumableUsageTable data={report} />
                </div>
            </div>
        </>
    )
}