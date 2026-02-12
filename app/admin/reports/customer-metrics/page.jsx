import { CustomerContributionTable, CustomerMetricsTable } from '@/components/report-table'
import { CustomerMetricsFilters } from '@/components/reports/metrics.filter'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getCustomerMetricsReport } from '@/lib/actions/reports.action'
import { auth } from '@/lib/auth'
import { CalendarRange, UserCheck, UserPlus, Users } from 'lucide-react'

export default async function CustomerMetricsPage({ searchParams }) {


    const searchP = await searchParams
    const session = await auth()


    const response = await getCustomerMetricsReport(
        session.franchiseId,
        searchP.startDate,
        searchP.endDate
    )

    if (!response?.success) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-red-500 font-medium">Failed to load customer metrics</p>
                    <p className="text-sm text-muted-foreground">
                        {response?.error || 'An unexpected error occurred'}
                    </p>
                </div>
            </div>
        )
    }

    const { data } = response
    const { summary, fiscalYear, reportPeriod } = data

    const summaryCards = [
        {
            title: 'Total Customers',
            value: summary?.totalCustomers ?? '-',
            icon: Users,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
        },
        {
            title: 'New Customers',
            value: summary?.newCustomers ?? '-',
            icon: UserPlus,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Existing Customers',
            value: summary?.existingCustomers ?? '-',
            icon: UserCheck,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ]

    return (

        <div className="p-6 w-full overflow-hidden">

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Customer Metrics Report
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monthly breakdown of customer acquisition and retention
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {fiscalYear && (
                        <Badge variant="outline" className="text-primary border-primary bg-primary/10 px-3 py-1">
                            <CalendarRange className="h-3.5 w-3.5 mr-1.5" />
                            {fiscalYear}
                        </Badge>
                    )}
                </div>
            </div>

            <CustomerMetricsFilters />

            {/* Summary Cards */}
            <div className=" w-full grid grid-cols-1 gap-4 sm:grid-cols-3 my-8">
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


            <div className='flex flex-col items-start gap-12' >
                {/* Table */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                        <h2 className="text-lg font-medium text-slate-900">Customer Base Table</h2>
                        <p className="mt-1 text-sm text-gray-600 font-light">
                            12-month comparison of customer acquisition and retention metrics
                        </p>
                    </div>
                    <div className="p-6 max-w-344 ">
                        <CustomerMetricsTable data={data} />
                    </div>
                </div>






                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 px-6 py-5">
                        <h2 className="text-lg font-medium text-slate-900">Customer Contribution (%)</h2>
                        <p className="mt-1 text-sm text-gray-600 font-light">
                            12-month comparison of customer metrics
                        </p>
                    </div>
                    <div className="p-6 max-w-344 ">
                        {/* Contribution Percentage Table */}
                        <CustomerContributionTable data={data} />
                    </div>
                </div>


            </div>
        </div>
    )
}