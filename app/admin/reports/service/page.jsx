import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getServiceTopPerformance } from "@/lib/actions/analytics_action";
import { auth } from "@/lib/auth";



export default async function ServicePerformance() {

    const session = await auth()
    const role = session?.user?.role
    const result = await getServiceTopPerformance()

    if (!result.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No service performance data found.</p>
                </CardContent>
            </Card>
        );
    }
    const service_performance = result.data

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold ">Service Performance</h1>
                    <p className="text-gray-600">Get data of service performance.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service name</TableHead>
                                <TableHead>Total revenue</TableHead>
                                <TableHead>Total bookings</TableHead>
                                {role === "SUPER_ADMIN" && <TableHead>Number of franchises</TableHead>}
                                {role === "SUPER_ADMIN" && <TableHead>Revenue per franchise</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {service_performance.map((service) => (
                                <TableRow
                                    key={service._id}
                                    className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">{service.serviceName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{service.totalRevenue}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {service.totalBookings}
                                    </TableCell>
                                    <TableCell>
                                        {role === "SUPER_ADMIN" && service.numberOfFranchises}
                                    </TableCell>
                                    <TableCell>
                                        {role === "SUPER_ADMIN" && service.revenuePerFranchise}
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
