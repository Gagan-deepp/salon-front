import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

// Helper to format currency
function formatCurrency(value) {
    if (!value) return "0"
    return new Intl.NumberFormat("en-IN").format(value)
}

// Helper to format growth percentage
function formatGrowth(value) {
    if (value === null || value === undefined) return "—"
    const sign = value > 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
}

// Helper to get color for growth
function growthColor(value) {
    if (value === null || value === undefined) return "text-slate-400"
    if (value > 0) return "text-emerald-600"
    if (value < 0) return "text-red-500"
    return "text-slate-400"
}

// Calculate YoY Growth (comparing same month previous year)
function calculateYoY(currentValue, previousYearValue) {
    if (!previousYearValue || previousYearValue === 0) return null
    return ((currentValue - previousYearValue) / previousYearValue) * 100
}

// Calculate QoQ Growth (comparing previous quarter)
function calculateQoQ(currentIndex, data) {
    if (currentIndex < 3) return null
    const currentValue = data[currentIndex]
    const previousQuarterValue = data[currentIndex - 3]
    if (!previousQuarterValue || previousQuarterValue === 0) return null
    return ((currentValue - previousQuarterValue) / previousQuarterValue) * 100
}

export function CustomerPurchaseTable({ data }) {
    if (!data || !data.categories) {
        return <div className="text-center py-8 text-muted-foreground">No data available</div>
    }

    const categories = Object.keys(data.categories)

    // Create rows for each category (Purchase Value + Avg Ticket)
    const rows = []
    categories.forEach(category => {
        const monthlyData = data.categories[category]
        rows.push({
            type: "purchase",
            label: `${category} Purchase Value (Rs.)`,
            category,
            data: monthlyData,
            valueKey: "purchaseValue"
        })
        rows.push({
            type: "avgTicket",
            label: `Avg ${category} Ticket (Rs.)`,
            category,
            data: monthlyData,
            valueKey: "avgTicketValue"
        })
    })

    return (
        <div className="rounded-md border overflow-auto">
            <Table>
                <TableHeader className="sticky top-0 z-20 bg-primary">
                    <TableRow>
                        <TableHead className="sticky left-0 z-30 bg-primary text-white font-bold min-w-[250px] shadow-xl">
                            Metric
                        </TableHead>
                        {data.categories[categories[0]]?.map((item) => (
                            <TableHead key={item.month} className="text-white text-center min-w-[100px]">
                                {item.month}
                            </TableHead>
                        ))}
                        <TableHead className="text-white text-center min-w-[80px]">YoY %</TableHead>
                        <TableHead className="text-white text-center min-w-[100px]">MYT D vs PYTD %</TableHead>
                        <TableHead className="text-white text-center min-w-[80px]">QoQ %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, rowIndex) => {
                        const values = row.data.map(item => item[row.valueKey])

                        // Calculate growth metrics for the last month with data
                        const lastIndex = values.length - 1
                        const lastValue = values[lastIndex]
                        const yoyGrowth = lastIndex >= 12 ? calculateYoY(lastValue, values[lastIndex - 12]) : null
                        const qoqGrowth = calculateQoQ(lastIndex, values)

                        // Calculate MYTD vs PYTD (sum of all months YTD)
                        const currentYearSum = values.slice(0, 12).reduce((sum, val) => sum + val, 0)
                        const previousYearSum = values.slice(12).reduce((sum, val) => sum + val, 0)
                        const mytdGrowth = previousYearSum ? ((currentYearSum - previousYearSum) / previousYearSum) * 100 : null

                        return (
                            <TableRow key={`${row.category}-${row.type}`} className={rowIndex % 2 === 0 ? "bg-muted" : "bg-gray-300"}>
                                <TableCell className="sticky left-0 z-10 font-medium bg-inherit shadow-xl">
                                    {row.label}
                                </TableCell>
                                {row.data.map((item) => (
                                    <TableCell key={item.month} className="text-center">
                                        {formatCurrency(item[row.valueKey])}
                                    </TableCell>
                                ))}
                                <TableCell className={`text-center font-medium ${growthColor(yoyGrowth)}`}>
                                    {formatGrowth(yoyGrowth)}
                                </TableCell>
                                <TableCell className={`text-center font-medium ${growthColor(mytdGrowth)}`}>
                                    {formatGrowth(mytdGrowth)}
                                </TableCell>
                                <TableCell className={`text-center font-medium ${growthColor(qoqGrowth)}`}>
                                    {formatGrowth(qoqGrowth)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
