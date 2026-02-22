import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, UserMinus } from "lucide-react"
import { format } from "date-fns"

export function ChurnRateTable({ data }) {
    if (!data || !data.customers || data.customers.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No churned customers found</div>
    }

    return (
        <div className="space-y-6">
            {/* Table */}
            <div className="rounded-md border overflow-auto">
                <Table>
                    <TableHeader className="bg-primary">
                        <TableRow>
                            <TableHead className="text-white font-bold">Customer Name</TableHead>
                            <TableHead className="text-white">Phone</TableHead>
                            <TableHead className="text-white text-center">Last Payment Date</TableHead>
                            <TableHead className="text-white text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.customers.map((customer, index) => (
                            <TableRow key={customer.customerId} className={index % 2 === 0 ? "bg-muted" : "bg-gray-300"}>
                                <TableCell className="font-semibold">{customer.name}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell className="text-center">
                                    {customer.lastPaymentDate ? format(new Date(customer.lastPaymentDate), "PPP") : "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive" className="gap-1">
                                        <UserMinus className="h-3 w-3" />
                                        Churned
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
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
                        <span className="font-bold mt-0.5">Note:</span>
                        <span>This report lists customers who have not made a payment recently (indicating potential churn).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">Action:</span>
                        <span>Consider contacting these customers with re-engagement offers or feedback requests.</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
