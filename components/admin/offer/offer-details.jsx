"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditOfferDialog } from "./edit-offer-dialog"
import { DeleteOfferDialog } from "./delete-offer-dialog"
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  DollarSign, 
  Users, 
  Percent,
  Tag,
  Clock,
  TrendingUp,
  Copy,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  EXPIRED: "bg-red-100 text-red-800",
  EXHAUSTED: "bg-orange-100 text-orange-800",
}

const offerTypeLabels = {
  PERCENTAGE: "Percentage Off",
  FIXED_AMOUNT: "Fixed Amount",
  BUY_X_GET_Y: "Buy X Get Y",
  FREE_SERVICE: "Free Service"
}

export function OfferDetails({ offer }) {
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.offerCode)
    toast.success(`Offer code "${offer.offerCode}" copied to clipboard`)
  }

  const usagePercent = offer.usageLimits.totalUsageLimit 
    ? (offer.usageLimits.currentUsageCount / offer.usageLimits.totalUsageLimit) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Offers
          </Button>
          <div className="my-4">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">{offer.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono font-bold text-blue-600 text-lg">
                    {offer.offerCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={statusColors[offer.status]}>
                {offer.status}
              </Badge>
              <Badge variant="outline">
                {offerTypeLabels[offer.offerType]}
              </Badge>
              {offer.conditions.firstTimeCustomersOnly && (
                <Badge variant="secondary">First-time customers only</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <DeleteOfferDialog offer={offer}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteOfferDialog>
          <EditOfferDialog offer={offer}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Offer
            </Button>
          </EditOfferDialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discount Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {offer.discount.type === 'PERCENTAGE' 
                    ? `${offer.discount.value}%` 
                    : formatCurrency(offer.discount.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {offer.discount.type} discount
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {offer.usageLimits.currentUsageCount}
                  {offer.usageLimits.totalUsageLimit 
                    ? ` / ${offer.usageLimits.totalUsageLimit}` 
                    : " / ∞"}
                </div>
                {offer.usageLimits.totalUsageLimit && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Min Purchase</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(offer.conditions.minPurchaseAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum amount required
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Per User Limit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {offer.usageLimits.perUserLimit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Uses per customer
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Offer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Offer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Offer Type</p>
                  <p className="text-sm text-muted-foreground">
                    {offerTypeLabels[offer.offerType]}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.description || "No description available"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Discount Details</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.discount.type === 'PERCENTAGE' 
                      ? `${offer.discount.value}% off` 
                      : `${formatCurrency(offer.discount.value)} off`}
                    {offer.discount.maxDiscountAmount && (
                      <span> (Max: {formatCurrency(offer.discount.maxDiscountAmount)})</span>
                    )}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Applicable On</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.conditions.applicableOn === 'ALL' ? 'All Items' : 
                     offer.conditions.applicableOn === 'SERVICES_ONLY' ? 'Services Only' :
                     offer.conditions.applicableOn === 'PRODUCTS_ONLY' ? 'Products Only' :
                     'Specific Items'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Validity Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Validity Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(offer.validity.startDate)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(offer.validity.endDate)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Status</p>
                  <Badge className={statusColors[offer.status]}>
                    {offer.status}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(offer.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Discount Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Discount Type</span>
                  <span className="font-medium">{offer.discount.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount Value</span>
                  <span className="font-medium">
                    {offer.discount.type === 'PERCENTAGE' 
                      ? `${offer.discount.value}%` 
                      : formatCurrency(offer.discount.value)}
                  </span>
                </div>
                {offer.discount.maxDiscountAmount && (
                  <div className="flex justify-between">
                    <span>Max Discount Cap</span>
                    <span className="font-medium">
                      {formatCurrency(offer.discount.maxDiscountAmount)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Usage Limit</span>
                  <span className="font-medium">
                    {offer.usageLimits.totalUsageLimit || 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Usage</span>
                  <span className="font-medium">
                    {offer.usageLimits.currentUsageCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Per User Limit</span>
                  <span className="font-medium">
                    {offer.usageLimits.perUserLimit}
                  </span>
                </div>
                {offer.usageLimits.totalUsageLimit && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Remaining Usage</span>
                      <span className="font-medium text-green-600">
                        {offer.usageLimits.totalUsageLimit - offer.usageLimits.currentUsageCount}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Minimum Purchase Amount</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(offer.conditions.minPurchaseAmount)}
                  </p>
                </div>
                {offer.conditions.maxPurchaseAmount && (
                  <div>
                    <p className="font-medium mb-1">Maximum Purchase Amount</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(offer.conditions.maxPurchaseAmount)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-medium mb-1">Applicable On</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.conditions.applicableOn === 'ALL' ? 'All Items' : 
                     offer.conditions.applicableOn === 'SERVICES_ONLY' ? 'Services Only' :
                     offer.conditions.applicableOn === 'PRODUCTS_ONLY' ? 'Products Only' :
                     'Specific Items'}
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Customer Restriction</p>
                  <p className="text-sm text-muted-foreground">
                    {offer.conditions.firstTimeCustomersOnly 
                      ? 'First-time customers only' 
                      : 'All customers'}
                  </p>
                </div>
              </div>

              {offer.conditions.applicableDays && offer.conditions.applicableDays.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Applicable Days</p>
                    <div className="flex flex-wrap gap-2">
                      {offer.conditions.applicableDays.map(day => (
                        <Badge key={day} variant="secondary">{day}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {offer.conditions.applicableTimeSlots && offer.conditions.applicableTimeSlots.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Applicable Time Slots</p>
                    <div className="space-y-2">
                      {offer.conditions.applicableTimeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
            </CardHeader>
            <CardContent>
              {offer.usageHistory && offer.usageHistory.length > 0 ? (
                <div className="space-y-4">
                  {offer.usageHistory.slice(0, 10).map((usage, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">
                          {formatCurrency(usage.discountApplied)} discount applied
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(usage.usedAt)}
                        </p>
                      </div>
                      <Badge variant="outline">Used</Badge>
                    </div>
                  ))}
                  {offer.usageHistory.length > 10 && (
                    <p className="text-sm text-center text-muted-foreground">
                      Showing 10 of {offer.usageHistory.length} uses
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No usage history yet</p>
                  <p className="text-sm mt-2">This offer hasn't been used by any customers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
