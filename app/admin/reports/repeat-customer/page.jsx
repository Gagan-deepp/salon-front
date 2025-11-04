import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRepeatCustomer } from "@/lib/actions/analytics_action"



export default async function RepeatCustomerPage() {

    const result = await getRepeatCustomer()

    if (!result.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No repeat customer data found.</p>
                </CardContent>
            </Card>
        );
    }


    const repeat_customer = result.data

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold ">Repeat Customer</h1>
                    <p className="text-gray-600">Get data of top repeated customer.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Total visits</TableHead>
                                <TableHead>Total spent</TableHead>
                                <TableHead>Number of franchises visited</TableHead>
                                <TableHead>First visit</TableHead>
                                <TableHead>Last visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repeat_customer.map((customer) => (
                                <TableRow
                                    key={customer._id}
                                    className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">{customer.customerName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{customer.customerPhone}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {customer.totalVisits}
                                    </TableCell>
                                    <TableCell>
                                        {customer.totalSpent}
                                    </TableCell>
                                    <TableCell>
                                        {customer.numberOfFranchisesVisited || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {customer.firstVisit}
                                    </TableCell>
                                    <TableCell>
                                        {customer.lastVisit}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
