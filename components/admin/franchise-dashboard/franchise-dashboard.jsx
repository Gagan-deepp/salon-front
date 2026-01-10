import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from "@/lib/auth"
import {
  Building2,
  CreditCard,
  Edit,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react'
import { DeleteFranchiseDialog } from "../franchise/delete-franchise-dialog"
import { EditFranchiseDialog } from "../franchise/edit-franchise-dialog"
import { CustomerChart } from "./customer-chart"
import { RevenueChart } from "./revenue-chart"

export async function FranchiseDashboard({ metrics, franchise, customerData, salesData }) {
  const { user } = await auth()
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary rounded-lg">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold ">{franchise.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{franchise.code}</Badge>
              <Badge variant={franchise.isActive ? "default" : "destructive"}>
                {franchise.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant={
                  franchise.subscription?.plan === "ENTERPRISE"
                    ? "default"
                    : franchise.subscription?.plan === "PREMIUM"
                      ? "secondary"
                      : "outline"
                }>
                {franchise?.subscription?.plan}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {(user?.role === "SUPER_ADMIN" || user?.role === "SAAS_OWNER") &&
          <>
          <EditFranchiseDialog franchise={franchise}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditFranchiseDialog>
          <DeleteFranchiseDialog franchise={franchise}>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteFranchiseDialog>
          </>
        }
      </div>


      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.total_sales)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_customers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.average_order_value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.daily_revenue)}</div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
          {/* <TabsTrigger value="subscription">Subscription</TabsTrigger> */}
          {/* <TabsTrigger value="performance">Performance</TabsTrigger> */}
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          {/* <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Customer Growth - Last 6 months</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerChart data={customerData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Street Address</p>
                  <p className="text-sm text-muted-foreground">{franchise.address?.street || "Not provided"}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">City</p>
                    <p className="text-sm text-muted-foreground">{franchise.address?.city}</p>
                  </div>
                  <div>
                    <p className="font-medium">State</p>
                    <p className="text-sm text-muted-foreground">{franchise.address?.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Pincode</p>
                    <p className="text-sm text-muted-foreground">{franchise.address?.pincode}</p>
                  </div>
                  <div>
                    <p className="font-medium">Country</p>
                    <p className="text-sm text-muted-foreground">{franchise.address?.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{franchise.contact?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{franchise.contact?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">{franchise.contact?.whatsapp}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">GST Number</p>
                  <p className="text-sm text-muted-foreground">{franchise.gstNumber || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <Badge
                    variant={franchise.settings?.loyaltyProgram?.enabled ? "default" : "secondary"}>
                    {franchise.settings?.loyaltyProgram?.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Points per Rupee</span>
                  <span className="font-medium">{franchise.settings?.loyaltyProgram?.pointsPerRupee || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Redemption Rate</span>
                  <span className="font-medium">{franchise.settings?.loyaltyProgram?.redemptionRate || 1}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="w-5 h-5 mr-2" />
                  Discount Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Maximum Discount</span>
                  <span className="font-medium">{franchise.settings?.discountLimits?.maxPercentage || 20}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Required</span>
                  <span className="font-medium">{franchise.settings?.discountLimits?.requireApproval || 15}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Cash</span>
                  <Badge
                    variant={franchise.settings?.paymentMethods?.cash ? "default" : "secondary"}>
                    {franchise.settings?.paymentMethods?.cash ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Card</span>
                  <Badge
                    variant={franchise.settings?.paymentMethods?.card ? "default" : "secondary"}>
                    {franchise.settings?.paymentMethods?.card ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>UPI</span>
                  <Badge
                    variant={franchise.settings?.paymentMethods?.upi ? "default" : "secondary"}>
                    {franchise.settings?.paymentMethods?.upi ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Wallet</span>
                  <Badge
                    variant={franchise.settings?.paymentMethods?.wallet ? "default" : "secondary"}>
                    {franchise.settings?.paymentMethods?.wallet ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Printer Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Receipt Header</p>
                  <p className="text-sm text-muted-foreground">
                    {franchise.settings?.printerSettings?.receiptHeader || "Not configured"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Receipt Footer</p>
                  <p className="text-sm text-muted-foreground">
                    {franchise.settings?.printerSettings?.receiptFooter || "Not configured"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">GST Enabled</p>
                  <Badge variant={franchise.settings?.gstEnabled ? "default" : "secondary"}>
                    {franchise.settings?.gstEnabled ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* <TabsContent value="subscription" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Plan</span>
                  <Badge
                    variant={
                      franchise.subscription?.plan === "ENTERPRISE"
                        ? "default"
                        : franchise.subscription?.plan === "PREMIUM"
                          ? "secondary"
                          : "outline"
                    }>
                    {franchise.subscription?.plan}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(franchise.subscription?.startDate)}</p>
                </div>
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(franchise.subscription?.endDate)}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={franchise.subscription?.isActive ? "default" : "destructive"}>
                    {franchise.subscription?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Subscription Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Days Remaining</span>
                    <span className="font-medium">{daysRemaining()} days</span>
                  </div>
                  <Progress value={subscriptionProgress()} className="h-2" />
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{Math.round(subscriptionProgress())}%</p>
                  <p className="text-sm text-muted-foreground">Subscription Used</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Monthly Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(500000)}</div>
                <div className="mt-2">
                  <Progress value={97} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">97% achieved</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Customer Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <p className="text-xs text-muted-foreground">Monthly growth</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Hair Cut & Style</span>
                  <span className="font-medium">₹45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facial Treatment</span>
                  <span className="font-medium">₹38,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bridal Makeup</span>
                  <span className="font-medium">₹32,000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Hair Serum</span>
                  <span className="font-medium">₹25,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Face Cream</span>
                  <span className="font-medium">₹18,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lipstick</span>
                  <span className="font-medium">₹12,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </div >
  );
}
