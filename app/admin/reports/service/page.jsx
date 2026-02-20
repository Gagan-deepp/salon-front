import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getServiceTopPerformance } from "@/lib/actions/analytics_action";
import { auth } from "@/lib/auth";
import { TrendingUp, BookOpen } from "lucide-react";

// Helper to format currency
function formatCurrency(value) {
    if (!value) return "0"
    const absValue = Math.abs(value)
    return new Intl.NumberFormat("en-IN").format(absValue)
}

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
                    <h1 className="text-3xl font-bold">Service Performance</h1>
                    <p className="text-gray-600">Get data of service performance.</p>
                </div>
            </div>
            
            <div className="space-y-6">
                {/* Table */}
                <div className="rounded-md border overflow-auto">
                    <Table>
                        <TableHeader className="bg-primary">
                            <TableRow>
                                <TableHead className="text-white font-bold min-w-[200px]">Service Name</TableHead>
                                <TableHead className="text-white text-center min-w-[150px]">Total Revenue (Rs.)</TableHead>
                                <TableHead className="text-white text-center min-w-[150px]">Total Bookings</TableHead>
                                {role === "SUPER_ADMIN" && (
                                    <TableHead className="text-white text-center min-w-[150px]">Number of Franchises</TableHead>
                                )}
                                {role === "SUPER_ADMIN" && (
                                    <TableHead className="text-white text-center min-w-[150px]">Revenue per Franchise (Rs.)</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {service_performance.map((service, index) => (
                                <TableRow
                                    key={service._id}
                                    className={`cursor-pointer ${index % 2 === 0 ? "bg-muted" : "bg-gray-300"}`}
                                >
                                    <TableCell className="font-semibold">{service.serviceName}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-medium">
                                            ₹{formatCurrency(service.totalRevenue)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {service.totalBookings}
                                    </TableCell>
                                    {role === "SUPER_ADMIN" && (
                                        <TableCell className="text-center font-medium">
                                            {service.numberOfFranchises}
                                        </TableCell>
                                    )}
                                    {role === "SUPER_ADMIN" && (
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-medium">
                                                ₹{formatCurrency(service.revenuePerFranchise)}
                                            </Badge>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* How to Read This Section */}
                <div className="rounded-lg border bg-muted/50 p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span>How to Read This</span>
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">▲</span>
                            <span><strong>Total Revenue:</strong> Shows the total revenue generated by each service across all bookings</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">→</span>
                            <span><strong>Total Bookings:</strong> Number of times each service has been booked</span>
                        </li>
                        {role === "SUPER_ADMIN" && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold mt-0.5">•</span>
                                    <span><strong>Number of Franchises:</strong> Shows how many franchise locations offer this service</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold mt-0.5">•</span>
                                    <span><strong>Revenue per Franchise:</strong> Average revenue generated per franchise for this service</span>
                                </li>
                            </>
                        )}
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">💡</span>
                            <span>Services with higher revenue and bookings indicate strong customer demand and preference</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}