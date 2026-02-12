import { ServiceBucketTable, ServiceMixTable } from '@/components/report-table-service'
import { ServiceBucketFilters } from '@/components/reports/service-bucket.filter'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getCustomerOverallBasket } from '@/lib/actions/reports.action'
import { auth } from '@/lib/auth'
import { CalendarRange, Scissors, Sparkles, Hand, Palette, FootprintsIcon, Heart } from 'lucide-react'

export default async function CustomerServiceBucketPage({ searchParams }) {
    const searchP = await searchParams
    const session = await auth()

    const response = await getCustomerOverallBasket(
        session.franchiseId,
        searchP.startDate,
        searchP.endDate,
        searchP.customerType || 'Overall'
    )

    if (!response?.success) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-red-500 font-medium">Failed to load service metrics</p>
                    <p className="text-sm text-muted-foreground">
                        {response?.error || 'An unexpected error occurred'}
                    </p>
                </div>
            </div>
        )
    }

    const { data } = response
    const { summary, fiscalYear, customerType } = data

    const categoryIcons = {
        'Hair': Scissors,
        'Skin': Sparkles,
        'Nails': Hand,
        'Makeup': Palette,
        'Pedicure': FootprintsIcon,
        'Body': Heart
    }

    const summaryCards = Object.entries(summary.categories || {}).map(([category, stats]) => ({
        title: category,
        value: stats.current ?? 0,
        icon: categoryIcons[category] || Scissors,
        growth: stats.yoyGrowth,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
    }))

    return (
        <div className="p-6 w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Customer Service Bucket Report
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Service category wise breakdown and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {customerType && (
                        <Badge variant="secondary" className="px-3 py-1">
                            {customerType}
                        </Badge>
                    )}
                    {fiscalYear && (
                        <Badge variant="outline" className="text-primary border-primary bg-primary/10 px-3 py-1">
                            <CalendarRange className="h-3.5 w-3.5 mr-1.5" />
                            {fiscalYear}
                        </Badge>
                    )}
                </div>
            </div>

            <ServiceBucketFilters />

            {/* Summary Cards */}
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-8">
                {summaryCards.map((card) => (
                    <Card key={card.title} className="shadow-sm border-slate-200">
                        <CardContent className="flex flex-col items-center gap-2 p-4">
                            <div className={`rounded-lg p-2 ${card.bg}`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {card.title}
                                </p>
                                <p className="text-xl font-bold tracking-tight text-slate-900">
                                    {card.value}
                                </p>
                                {card.growth !== undefined && card.growth !== 0 && (
                                    <p className={`text-xs font-medium ${card.growth >= 0 ? 'text-emerald-600' : 'text-red-500'
                                        }`}>
                                        {card.growth > 0 ? '+' : ''}{card.growth.toFixed(1)}%
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Total Summary Card */}
            <Card className="shadow-sm border-slate-200 mb-8">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg p-3 bg-primary/10">
                        <Scissors className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Total Service Count
                        </p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                {summary.total?.current ?? 0}
                            </p>
                            {summary.total?.yoyGrowth !== undefined && summary.total?.yoyGrowth !== 0 && (
                                <p className={`text-sm font-semibold ${summary.total?.yoyGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'
                                    }`}>
                                    {summary.total?.yoyGrowth > 0 ? '+' : ''}
                                    {summary.total?.yoyGrowth.toFixed(1)}% YoY
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                    <h2 className="text-lg font-medium text-slate-900">Service Category Performance</h2>
                    <p className="mt-1 text-sm text-gray-600 font-light">
                        12-month comparison of service counts across categories
                    </p>
                </div>
                <div className="p-6 max-w-344">
                    <ServiceBucketTable data={data} />
                </div>
            </div>

            {/* Service Mix Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mt-8">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                    <h2 className="text-lg font-medium text-slate-900">Overall Customer Basket - Service Mix (%)</h2>
                    <p className="mt-1 text-sm text-gray-600 font-light">
                        Monthly percentage distribution across service categories
                    </p>
                </div>
                <div className="p-6 max-w-344">
                    <ServiceMixTable data={data} />
                </div>
            </div>
        </div>
    )
}
