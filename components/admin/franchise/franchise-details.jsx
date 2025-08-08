"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditFranchiseDialog } from "./edit-franchise-dialog"
import { DeleteFranchiseDialog } from "./delete-franchise-dialog"
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  CreditCard,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Trash2,
} from "lucide-react"

export function FranchiseDetails({ franchise }) {
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold ">{franchise.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{franchise.code}</Badge>
              <Badge variant={franchise.isActive ? "default" : "destructive"}>
                {franchise.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <DeleteFranchiseDialog franchise={franchise}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteFranchiseDialog>
          <EditFranchiseDialog franchise={franchise}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditFranchiseDialog>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(franchise.analytics?.totalSales || 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(franchise.analytics?.totalCustomers || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Bill Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(franchise.analytics?.averageBillValue || 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{franchise.subscription?.plan}</div>
                <p className="text-xs text-muted-foreground">Expires {formatDate(franchise.subscription?.endDate)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {franchise.address?.street && `${franchise.address.street}, `}
                      {franchise.address?.city}, {franchise.address?.state} {franchise.address?.pincode}
                      <br />
                      {franchise.address?.country}
                    </p>
                  </div>
                </div>
                <Separator />
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
                {franchise.contact?.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">{franchise.contact.whatsapp}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">GST Number</p>
                  <p className="text-sm text-muted-foreground">{franchise.gstNumber || "Not provided"}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(franchise.createdAt)}</p>
                </div>
                <div>
                  <p className="font-medium">Subscription Plan</p>
                  <div className="flex items-center space-x-2 mt-1">
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
                    <span className="text-sm text-muted-foreground">
                      Until {formatDate(franchise.subscription?.endDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Enabled</span>
                  <Badge
                    variant={franchise.settings?.loyaltyProgram?.enabled ? "default" : "secondary"}>
                    {franchise.settings?.loyaltyProgram?.enabled ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Points per Rupee</span>
                  <span>{franchise.settings?.loyaltyProgram?.pointsPerRupee || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Redemption Rate</span>
                  <span>{franchise.settings?.loyaltyProgram?.redemptionRate || 1}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
