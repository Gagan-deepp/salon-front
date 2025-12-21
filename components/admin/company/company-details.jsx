"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditCompanyDialog } from "./edit-company-dialog"
import { UpdateSubscriptionDialog } from "./update-subscription-dialog"
import { 
  ArrowLeft, 
  Edit, 
  Building2, 
  DollarSign, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  TrendingUp,
  Settings,
  Crown,
  Activity
} from "lucide-react"

const SUBSCRIPTION_PLANS = {
  BASIC: { label: "Basic", color: "bg-blue-100 text-blue-800" },
  STANDARD: { label: "Standard", color: "bg-green-100 text-green-800" },
  PREMIUM: { label: "Premium", color: "bg-purple-100 text-purple-800" },
}

const SUBSCRIPTION_STATUS = {
  TRIAL: { label: "Trial", variant: "secondary" },
  ACTIVE: { label: "Active", variant: "default" },
  INACTIVE: { label: "Inactive", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "destructive" },
}

export function CompanyDetails({ company }) {
  const router = useRouter()
  console.log("company=0=-=-=-=-=-",company)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getPlanDetails = (plan) => {
    return SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS['BASIC']
  }

  const getStatusDetails = (status) => {
    return SUBSCRIPTION_STATUS[status] || SUBSCRIPTION_STATUS['INACTIVE']
  }

  const planDetails = getPlanDetails(company.data.subscription?.plan)
  const statusDetails = getStatusDetails(company.data.subscription?.status)

  // Calculate usage percentages
  const userUsagePercent = company.data.stats?.users ? 
    (company.data.stats.users.current / company.data.stats.users.limit) * 100 : 0
  const franchiseUsagePercent = company.data.stats?.franchises ? 
    (company.data.stats.franchises.current / company.data.stats.franchises.limit) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
          <div className="my-4">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              
              <div>
                <h1 className="text-3xl font-bold">{company.data.name}</h1>
                <p className="text-lg text-muted-foreground">{company.data.companyId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={planDetails.color}>
                {planDetails.label} Plan
              </Badge>
              <Badge variant={statusDetails.variant}>
                {statusDetails.label}
              </Badge>
              <Badge variant={company.data.isActive ? "default" : "destructive"}>
                {company.data.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <UpdateSubscriptionDialog company={company}>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Update Subscription
            </Button>
          </UpdateSubscriptionDialog>
          <EditCompanyDialog company={company}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
          </EditCompanyDialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(company.data.subscription?.monthlyPrice || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  per month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {company.data.stats?.users?.current || 0}/{company.data.stats?.users?.limit || 0}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(userUsagePercent, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {userUsagePercent.toFixed(1)}% used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locations</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {company.data.stats?.franchises?.current || 0}/{company.data.stats?.franchises?.limit || 0}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(franchiseUsagePercent, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {franchiseUsagePercent.toFixed(1)}% used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(company.data.stats?.revenue?.monthly || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {company.data.stats?.revenue?.totalTransactions || 0} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Company Name</p>
                  <p className="text-sm text-muted-foreground">{company.data.name}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Company ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{company.data.companyId}</p>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{company.data.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{company.data.phone}</p>
                  </div>
                </div>
                {company.data.address && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            company.data.address.street,
                            company.data.address.city,
                            company.data.address.state,
                            company.data.address.country,
                            company.data.address.zipCode
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Owner Name</p>
                  <p className="text-sm text-muted-foreground">{company.data.owner?.name}</p>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Owner Email</p>
                    <p className="text-sm text-muted-foreground">{company.data.owner?.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Owner Phone</p>
                    <p className="text-sm text-muted-foreground">{company.data.owner?.phone}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Registration Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(company.data.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <Badge className={planDetails.color}>
                    {planDetails.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge variant={statusDetails.variant}>
                    {statusDetails.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Price</span>
                  <span className="font-medium">{formatCurrency(company.data.subscription?.monthlyPrice || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date</span>
                  <span className="font-medium">
                    {company.data.subscription?.startDate ? formatDate(company.data.subscription.startDate) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>End Date</span>
                  <span className="font-medium">
                    {company.data.subscription?.endDate ? formatDate(company.data.subscription.endDate) : 'N/A'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Max Users</span>
                  <span className="font-bold">{company.data.subscription?.maxUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Max Locations</span>
                  <span className="font-bold">{company.data.subscription?.maxFranchises || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Users</span>
                  <span className="font-medium">{company.data.stats?.users?.current || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Users</span>
                  <span className="font-medium text-green-600">{company.data.stats?.users?.remaining || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Current Locations</span>
                  <span className="font-medium">{company.data.stats?.franchises?.current || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Locations</span>
                  <span className="font-medium text-green-600">{company.data.stats?.franchises?.remaining || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Monthly Revenue</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(company.data.stats?.revenue?.monthly || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transactions</span>
                  <span className="font-medium">{company.data.stats?.revenue?.totalTransactions || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {((company.data.stats?.users?.current || 0) / (company.data.stats?.users?.limit || 1) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Capacity Utilized</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(userUsagePercent, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((company.data.stats?.franchises?.current || 0) / (company.data.stats?.franchises?.limit || 1) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Locations Active</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(franchiseUsagePercent, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(company.data.stats?.revenue?.monthly || 0)}
                </div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {company.data.stats?.revenue?.totalTransactions || 0} transactions
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subscription Revenue</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(company.data.subscription?.monthlyPrice || 0)}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Business Revenue</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(company.data.stats?.revenue?.monthly || 0)}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average per Transaction</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        (company.data.stats?.revenue?.monthly || 0) / (company.data.stats?.revenue?.totalTransactions || 1)
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Since</span>
                    <span className="text-sm font-medium">{formatDate(company.data.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm font-medium">{formatDate(company.data.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Account Status</span>
                    <Badge variant={company.data.isActive ? "default" : "destructive"}>
                      {company.data.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    Current account is {company.data.isActive ? 'active' : 'inactive'}
                  </p>
                </div>
                <Badge variant={company.data.isActive ? "default" : "destructive"}>
                  {company.data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Subscription Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Currently on {planDetails.label} plan
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={planDetails.color}>
                    {planDetails.label}
                  </Badge>
                  <UpdateSubscriptionDialog company={company}>
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </UpdateSubscriptionDialog>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Data & Privacy</p>
                  <p className="text-sm text-muted-foreground">
                    Manage company data and privacy settings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
