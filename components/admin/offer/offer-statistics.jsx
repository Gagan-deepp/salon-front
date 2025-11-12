"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, DollarSign, Percent, Award } from "lucide-react"

export function OfferStatistics({ offer, statistics }) {
  const router = useRouter()

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
            Back to Offer
          </Button>
          <div className="my-4">
            <h1 className="text-3xl font-bold">Offer Statistics</h1>
            <p className="text-muted-foreground mt-1">
              Performance metrics for <span className="font-mono font-semibold">{offer.offerCode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.remainingUsage !== null 
                ? `${statistics.remainingUsage} remaining` 
                : 'Unlimited'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(statistics.totalDiscountGiven)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total savings provided
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Different users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(statistics.averageDiscountPerUse)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Usage efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Uses</span>
              <span className="font-semibold">{statistics.totalUsage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Remaining Uses</span>
              <span className="font-semibold text-green-600">
                {statistics.remainingUsage !== null ? statistics.remainingUsage : '∞'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unique Customers</span>
              <span className="font-semibold">{statistics.uniqueCustomers}</span>
            </div>
            {offer.usageLimits.totalUsageLimit && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(statistics.conversionRate, 100)}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Discount Given</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(statistics.totalDiscountGiven)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average per Use</span>
              <span className="font-semibold">
                {formatCurrency(statistics.averageDiscountPerUse)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Discount Type</span>
              <span className="font-semibold">
                {offer.discount.type === 'PERCENTAGE' 
                  ? `${offer.discount.value}%` 
                  : formatCurrency(offer.discount.value)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
