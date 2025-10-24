import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFranchises } from "@/lib/actions/franchise_action"
import { Building2, Users, TrendingUp, DollarSign } from "lucide-react"
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton"
import { auth } from "@/lib/auth"
import { getOwnerMetrics } from "@/lib/actions/analytics_action"

async function DashboardStats() {

  const session = await auth()

  console.log("Session in page ==> ", session)
  // Fetch franchises data
  const result = await getFranchises({ limit: 100 })

  const metrics = await getOwnerMetrics();



  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load bookings: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  // console.log("admin page Result ==> ", result.data.data)

  // Use dummy data for preview if API fails`
  const franchises = result.data.data

  const totalFranchises = franchises.length
  const activeFranchises = franchises.filter((f) => f.isActive).length
  const totalSales = franchises.reduce((sum, f) => sum + (f.analytics?.totalSales || 0), 0)
  const totalCustomers = franchises.reduce((sum, f) => sum + (f.analytics?.totalCustomers || 0), 0)

  const stats = [
    {
      title: "Total Franchises",
      value: metrics.data.total_franchises,
      description: `${activeFranchises} active`,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Sales",
      value: `₹${metrics.data.total_sales}`,
      description: "Across all franchises",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Customers",
      value: metrics.data.total_customers,
      description: "Across all franchises",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg. Order Value",
      value: `₹${metrics.data.average_order_value}`,
      description: "Per customer",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="text-gray-600">Overview of your franchise operations</p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
