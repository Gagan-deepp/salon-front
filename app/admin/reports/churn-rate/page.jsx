import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getChurnRate, getRepeatCustomer } from "@/lib/actions/analytics_action"



export default async function ChurnRatePage() {

    const result = await getChurnRate()

    if (!result.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No churn rate data found.</p>
                </CardContent>
            </Card>
        );
    }


    const churn_rate = result.data

    console.log("churn_rate", churn_rate)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold ">Churn Rate</h1>
                    <p className="text-gray-600">Get churn rate data.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Franchise name</TableHead>
                                <TableHead>Total customers</TableHead>
                                <TableHead>Churn count</TableHead>
                                <TableHead>Churn rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {churn_rate.map((customer) => (
                                <TableRow
                                    key={customer._id}
                                    className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">{customer.franchiseName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{customer.totalCustomers || "-"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {customer.churnCount ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                        {customer.churnRate ?? "-"}
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
