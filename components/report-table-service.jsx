'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export function ServiceBucketTable({ data, loading = false }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-primary/50" />
                    <p className="text-sm text-muted-foreground">Loading service metrics...</p>
                </div>
            </div>
        )
    }

    if (!data || !data.metrics) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">No data available</p>
            </div>
        )
    }

    const { metrics } = data

    // Get all categories from first month
    const categories = metrics[0]?.categories ? Object.keys(metrics[0].categories) : []

    const rows = [
        ...categories.map(cat => ({ label: `${cat} - Service Count`, key: cat, isCategory: true })),
        { label: 'Total Service Count', key: 'totalServiceCount', isTotal: true }
    ]

    const formatGrowth = (val) => {
        if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return '—'
        return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`
    }

    const growthColor = (val) => {
        if (val === null || val === undefined || isNaN(val) || !isFinite(val))
            return 'text-slate-400'
        return val >= 0 ? 'text-emerald-600' : 'text-red-500'
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary/90">
                        <TableHead className="sticky p-4 left-0 text-white font-medium bg-primary hover:bg-primary/90">
                            Metric
                        </TableHead>
                        {metrics.map((item) => (
                            <TableHead
                                key={item.month}
                                className="text-white p-4 font-medium text-center min-w-16 whitespace-nowrap"
                            >
                                {item.month}
                            </TableHead>
                        ))}
                        <TableHead className="text-white p-4 font-medium text-center min-w-[100px] bg-primary border-l border-primary-foreground">
                            YoY %
                        </TableHead>
                        <TableHead className="text-white p-4 font-medium text-center min-w-[120px] bg-primary border-l border-primary-foreground">
                            MYTD vs PYTD %
                        </TableHead>
                        <TableHead className="text-white p-4 font-medium text-center min-w-[100px] bg-primary border-l border-primary-foreground">
                            QoQ %
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, rowIndex) => {
                        const isTotal = row.isTotal
                        // Get the last month's growth metrics
                        const lastMonth = metrics[metrics.length - 1]
                        const yoy = isTotal ? lastMonth?.totalServiceCount?.yoyGrowth : lastMonth?.categories?.[row.key]?.yoyGrowth
                        const mytd = isTotal ? lastMonth?.totalServiceCount?.mytdVsPytd : lastMonth?.categories?.[row.key]?.mytdVsPytd
                        const qoq = isTotal ? lastMonth?.totalServiceCount?.qoqGrowth : lastMonth?.categories?.[row.key]?.qoqGrowth

                        return (
                            <TableRow
                                key={row.key}
                                className={`${rowIndex % 2 === 0 ? 'bg-muted' : 'bg-gray-300'} hover:bg-slate-200 transition-colors`}
                            >
                                <TableCell
                                    className={`sticky left-0 font-medium p-4 shadow-xl hover:bg-slate-200 transition-colors border-l border-primary-foreground ${rowIndex % 2 === 0 ? 'bg-muted' : 'bg-gray-300'
                                        }`}
                                >
                                    {row.label}
                                </TableCell>
                                {metrics.map((item) => {
                                    const value = isTotal
                                        ? item.totalServiceCount?.count
                                        : item.categories?.[row.key]?.count

                                    return (
                                        <TableCell
                                            key={`${row.key}-${item.month}`}
                                            className="text-center p-4 font-medium tabular-nums"
                                        >
                                            {value ?? 0}
                                        </TableCell>
                                    )
                                })}
                                <TableCell className={`text-center p-4 font-medium border-l border-slate-200 tabular-nums ${growthColor(yoy)}`}>
                                    {formatGrowth(yoy)}
                                </TableCell>
                                <TableCell className={`text-center p-4 font-medium tabular-nums ${growthColor(mytd)}`}>
                                    {formatGrowth(mytd)}
                                </TableCell>
                                <TableCell className={`text-center p-4 font-medium tabular-nums ${growthColor(qoq)}`}>
                                    {formatGrowth(qoq)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

// Service Mix Percentage Table
export function ServiceMixTable({ data, loading = false }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-primary/50" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!data || !data.metrics) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">No data available</p>
            </div>
        )
    }

    const { metrics } = data

    // Get all categories
    const categories = metrics[0]?.categories ? Object.keys(metrics[0].categories) : []

    const rows = categories.map(cat => ({ label: `${cat} %`, key: cat }))

    const calculatePercentage = (item, key) => {
        const categoryCount = item.categories?.[key]?.count || 0
        const total = item.totalServiceCount?.count || 0
        if (total === 0) return '—'
        return `${((categoryCount / total) * 100).toFixed(1)}%`
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-white hover:bg-white border-b-2 border-slate-300">
                        <TableHead className="sticky left-0 bg-white text-slate-900 font-medium p-4">
                            Metric
                        </TableHead>
                        {metrics.map((item) => (
                            <TableHead
                                key={item.month}
                                className="text-slate-900 font-medium text-center p-4 min-w-16 whitespace-nowrap"
                            >
                                {item.month}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow
                            key={row.key}
                            className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors border-b border-slate-200`}
                        >
                            <TableCell className={`sticky left-0 font-medium text-slate-800 p-4 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                {row.label}
                            </TableCell>
                            {metrics.map((item) => (
                                <TableCell
                                    key={`${row.key}-${item.month}`}
                                    className="text-center p-4 font-medium tabular-nums"
                                >
                                    {calculatePercentage(item, row.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
