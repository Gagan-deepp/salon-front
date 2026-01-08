"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Crown,
  Store,
  Calculator,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react"

export function UserDetails({ user, performance, referrals }) {
  const router = useRouter()

  const getRoleIcon = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="h-4 w-4" />
      case "FRANCHISE_OWNER":
        return <Store className="h-4 w-4" />
      case "CASHIER":
        return <Calculator className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive"
      case "FRANCHISE_OWNER":
        return "default"
      case "CASHIER":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="my-4">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                {getRoleIcon(user.role)}
                {user.role?.replace("_", " ")}
              </Badge>
              <div className="flex items-center gap-1">
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <DeleteUserDialog user={user}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteUserDialog>
          <EditUserDialog user={user}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditUserDialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        {/* <TabsList> */}
        {/* <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger> */}
          {user.role === "CASHIER" && <TabsTrigger value="commission">Commission</TabsTrigger>}
        {/* </TabsList> */}

        {/* <TabsContent value="overview" className="space-y-4"> */}
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.totalReferrals || 0}</div>
                <p className="text-xs text-muted-foreground">Customers referred</p>
              </CardContent>
            </Card>

            {user.role === "CASHIER" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(user.totalCommissionEarned || 0)}</div>
                    <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(user.pendingCommission || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting payout</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.referralCode}</div>
                    <p className="text-xs text-muted-foreground">Personal code</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div> */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Email Verified</p>
                  <div className="flex items-center gap-1">
                    {user.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${user.emailVerified ? "text-green-700" : "text-red-700"}`}>
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
                {user.franchiseId && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium">Franchise</p>
                      <p className="text-sm text-muted-foreground">{user.franchiseId.name}</p>
                      <p className="text-xs text-muted-foreground">{user.franchiseId.address}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Last Login</p>
                  <p className="text-sm text-muted-foreground">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Account Status</p>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        {/* </TabsContent> */}

        {/* <TabsContent value="performance" className="space-y-4">
          {performance ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Sales</span>
                    <span className="font-medium">{formatCurrency(performance.monthlySales || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services Completed</span>
                    <span className="font-medium">{performance.servicesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Rating</span>
                    <span className="font-medium">{performance.averageRating || "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No performance data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent> */}

        {user.role === "CASHIER" && (
          <TabsContent value="commission" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <Badge variant="secondary">{user.commissionStructure?.type || "PERCENTAGE"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Rate</span>
                    <span className="font-medium">{user.commissionStructure?.defaultServiceRate || 10}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product Rate</span>
                    <span className="font-medium">{user.commissionStructure?.defaultProductRate || 5}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commission Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Earned</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(user.totalCommissionEarned || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-medium text-orange-600">{formatCurrency(user.pendingCommission || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Code</span>
                    <Badge variant="outline">{user.referralCode}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Referrals */}
            {referrals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrals.map((referral, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{referral.customerName?.charAt(0)?.toUpperCase() || "C"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{referral.customerName}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(referral.createdAt)}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{formatCurrency(referral.commissionEarned)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
