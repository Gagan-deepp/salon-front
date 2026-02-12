'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function CustomerMetricsTable({ data, loading = false, title }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-primary/50" />
                    <p className="text-sm text-muted-foreground">Loading metrics...</p>
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

    const { metrics, summary } = data

    const rows = [
        { label: 'New Customers', key: 'newCustomers' },
        { label: 'Existing Customers', key: 'existingCustomers' },
        { label: 'Total Customers', key: 'totalCustomers' },
    ]

    // ── Growth calculations ──────────────────────────────────────────────

    const calculateYoY = (key) => {
        if (!metrics || metrics.length < 13) return null
        const current = metrics[metrics.length - 1][key] || 0
        const previous = metrics[0][key] || 0
        if (previous === 0) return current > 0 ? 100 : null
        return ((current - previous) / previous) * 100
    }

    const calculateMYTD = (key) => {
        if (!metrics || metrics.length < 13) return null
        const currentYTD = metrics.slice(1).reduce((s, m) => s + (m[key] || 0), 0)
        // Previous YTD data not available in single-year payload
        return null
    }

    const calculateQoQ = (key) => {
        if (!metrics || metrics.length < 6) return null
        const last3 = metrics.slice(-3)
        const prev3 = metrics.slice(-6, -3)
        const curSum = last3.reduce((s, m) => s + (m[key] || 0), 0)
        const prevSum = prev3.reduce((s, m) => s + (m[key] || 0), 0)
        if (prevSum === 0) return curSum > 0 ? 100 : null
        return ((curSum - prevSum) / prevSum) * 100
    }

    const formatGrowth = (val) => {
        if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return '-'
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
                            YoY Growth
                        </TableHead>
                        <TableHead className="text-white p-4 font-medium text-center min-w-[120px] bg-primary border-l border-primary-foreground">
                            MYTD vs PYTD
                        </TableHead>
                        <TableHead className="text-white p-4 font-medium text-center min-w-[100px] bg-primary border-l border-primary-foreground">
                            QoQ Growth
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, rowIndex) => {
                        const yoy = calculateYoY(row.key)
                        const mytd = calculateMYTD(row.key)
                        const qoq = calculateQoQ(row.key)
                        const isLast = rowIndex === rows.length - 1

                        return (
                            <TableRow
                                key={row.key}
                                className={`${rowIndex % 2 === 0 ? 'bg-muted' : 'bg-gray-300'
                                    } hover:bg-slate-200 transition-colors`}
                            >
                                <TableCell className={`sticky left-0 font-medium border-l border-primary-foreground text-slate-900 p-4 shadow-xl hover:bg-slate-200 transition-colors ${rowIndex % 2 === 0 ? 'bg-muted' : 'bg-gray-300'} `}>
                                    {row.label}
                                </TableCell>
                                {metrics.map((item) => (
                                    <TableCell
                                        key={`${row.key}-${item.month}`}
                                        className="text-center font-medium p-4"
                                    >
                                        {item[row.key]}
                                    </TableCell>
                                ))}
                                <TableCell className={`text-center p-4 font-medium border-l border-slate-200 tabular-nums ${growthColor(yoy)}`}>
                                    {formatGrowth(yoy)}
                                </TableCell>
                                <TableCell className={`text-center font-medium tabular-nums ${growthColor(mytd)}`}>
                                    {summary && summary[row.key + 'Growth'] != null
                                        ? formatGrowth(summary[row.key + 'Growth'])
                                        : '-'}
                                </TableCell>
                                <TableCell className={`text-center font-medium tabular-nums ${growthColor(qoq)}`}>
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

// Customer Contribution Percentage Table
export function CustomerContributionTable({ data, loading = false }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
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

    const rows = [
        { label: 'New Customer Contribution %', key: 'newCustomers' },
        { label: 'Existing Customer Contribution %', key: 'existingCustomers' },
    ]

    const calculatePercentage = (item, key) => {
        const total = item.totalCustomers || 0
        const value = item[key] || 0
        if (total === 0) return '-'
        return `${((value / total) * 100).toFixed(1)}%`
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <div className="w-full overflow-x-auto rounded-lg border border-border">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-white hover:bg-white border-b-2 border-slate-300">
                                <TableHead className="sticky left-0 bg-white text-slate-900 font-medium p-4">
                                    Metric
                                </TableHead>
                                {metrics.map((item, idx) => (
                                    <TableHead
                                        key={item.month}
                                        className={`text-slate-900 font-medium text-center p-4 min-w-16 whitespace-nowrap ${idx === metrics.length - 1 ? 'font-bold' : ''}`}
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
                                    {metrics.map((item, idx) => (
                                        <TableCell
                                            key={`${row.key}-${item.month}`}
                                            className={`text-center p-4 tabular-nums ${idx === metrics.length - 1 ? 'font-bold' : 'font-medium'}`}
                                        >
                                            {calculatePercentage(item, row.key)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
