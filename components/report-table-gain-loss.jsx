import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { TrendingUp, TrendingDown, BookAIcon, BookOpen } from "lucide-react"

// Helper to format currency
function formatCurrency(value) {
    if (!value) return "0"
    const absValue = Math.abs(value)
    return new Intl.NumberFormat("en-IN").format(absValue)
}

// Helper to format signed currency (with + or - sign)
function formatSignedCurrency(value) {
    if (!value) return "0"
    const sign = value > 0 ? "+" : ""
    return `${sign}${new Intl.NumberFormat("en-IN").format(value)}`
}

export function GainLossTable({ data }) {
    if (!data || !data.serviceGainLoss) {
        return <div className="text-center py-8 text-muted-foreground">No data available</div>
    }

    const { serviceGainLoss, total, analysisPeriod, basePeriod } = data

    return (
        <div className="space-y-6">
            {/* Table */}
            <div className="rounded-md border overflow-auto">
                <Table>
                    <TableHeader className="bg-primary">
                        <TableRow>
                            <TableHead className="text-white font-bold min-w-[150px]">Service</TableHead>
                            <TableHead className="text-white text-center min-w-[150px]">
                                {basePeriod?.label || "Base Period"} Value (Rs.)
                            </TableHead>
                            <TableHead className="text-white text-center min-w-[150px]">
                                {analysisPeriod?.label || "Analysis Period"} Value (Rs.)
                            </TableHead>
                            <TableHead className="text-white text-center min-w-[150px]">Gain / Loss (Rs.)</TableHead>
                            <TableHead className="text-white text-center min-w-[120px]">Net Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serviceGainLoss.map((item, index) => (
                            <TableRow key={item.service} className={index % 2 === 0 ? "bg-muted" : "bg-gray-300"}>
                                <TableCell className="font-semibold">{item.service}</TableCell>
                                <TableCell className="text-center">{formatCurrency(item.baseValue)}</TableCell>
                                <TableCell className="text-center">{formatCurrency(item.analysisValue)}</TableCell>
                                <TableCell className={`text-center font-medium ${item.gainLoss > 0 ? "text-emerald-600" : item.gainLoss < 0 ? "text-red-500" : "text-slate-400"}`}>
                                    {formatSignedCurrency(item.gainLoss)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.gainLoss !== 0 ? (
                                        <Badge variant={item.netChange === "Loss" ? "destructive" : "default"} className="gap-1">
                                            {item.netChange === "Loss" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                            {item.netChange}
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">—</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Total Row */}
                        <TableRow className="bg-primary font-bold">
                            <TableCell className="text-white">Total</TableCell>
                            <TableCell className="text-white text-center">{formatCurrency(total.baseValue)}</TableCell>
                            <TableCell className="text-white text-center">{formatCurrency(total.analysisValue)}</TableCell>
                            <TableCell className={`text-center ${total.gainLoss > 0 ? "text-emerald-300" : total.gainLoss < 0 ? "text-red-300" : "text-white"}`}>
                                {formatSignedCurrency(total.gainLoss)}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={total.netChange === "Net Loss" ? "destructive" : "default"} className="gap-1 bg-white text-primary">
                                    {total.netChange === "Net Loss" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                    {total.netChange}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* How to Read This Section */}
            <div className="rounded-lg border bg-muted/50 p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span> <BookOpen /> </span> How to Read This
                </h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">▲</span>
                        <span>Services with <strong className="text-emerald-600">Gain</strong> are driving incremental value from the same customer cohort</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">▼</span>
                        <span>Services with <strong className="text-red-500">Loss</strong> show drop-off in purchase value among retained customers</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">→</span>
                        <span><strong>Overall:</strong> Analyzes the same customers across both periods to identify service mix shifts</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5"> - </span>
                        <span>Higher total value indicates customers are spending more; clear mix shift reveals changing preferences</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
