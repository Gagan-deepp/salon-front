import CrossFranchiseChart from "@/components/admin/cross-franchise-chart"
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton"
import Leaderboard from "@/components/admin/Leaderboard-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCrossFranchise, getLeaderBoard, getOwnerMetrics } from "@/lib/actions/analytics_action"
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react"
import { Suspense } from "react"

async function DashboardStats() {

  const metrics = await getOwnerMetrics();

  const [crossFranchise, leaderBoard] = await Promise.all([
    getCrossFranchise(),
    getLeaderBoard(),
  ]);


  if (!metrics.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load bookings: {metrics.error}</p>
        </CardContent>
      </Card>
    );
  }


  const stats = [
    {
      title: "Total Franchises",
      value: metrics.data.total_franchises,
      description: `Active franchisees`,
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
    <div className="space-y-8" >

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

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard : Top 5 franchise in your company</CardTitle>
        </CardHeader>
        <CardContent className="w-full" >
          <Leaderboard data={leaderBoard.data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cross Franchise Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="w-full" >
          <CrossFranchiseChart data={crossFranchise.data} />
        </CardContent>
      </Card>
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
