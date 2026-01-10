"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { DeleteCustomerDialog } from "./delete-customer-dialog"
import { CustomerHistoryTable } from "./customer-history-table"
import { getCustomerHistory, getCustomerStats } from "@/lib/actions/customer_action"
import { ArrowLeft, Edit, User, Phone, Mail, MapPin, Calendar, Star, TrendingUp, DollarSign, Clock, Trash2, MessageSquare } from 'lucide-react'

const GENDER_LABELS = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
}

export function CustomerDetails({ customer }) {
  const [customerHistory, setCustomerHistory] = useState([])
  const [customerStats, setCustomerStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadCustomerData = async () => {
      setLoading(true)
      try {
        // Load customer history
        const historyResult = await getCustomerHistory(customer._id, { limit: 10 })
        if (historyResult.success) {
          setCustomerHistory(historyResult.data.history || historyResult.data || [])
        }
        console.log("historyResult",historyResult)

        // Load customer stats
        const statsResult = await getCustomerStats(customer._id, {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          endDate: new Date().toISOString(),
        })
        if (statsResult.success) {
          setCustomerStats(statsResult.data)
        }
      } catch (error) {
        console.error("Error loading customer data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomerData()
  }, [customer._id])

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

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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
          <div className="my-4" >
            <h1 className="text-3xl font-bold ">{customer.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{customer.phone}</Badge>
              <Badge variant={customer.isActive ? "default" : "destructive"}>
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>

              <Badge variant={customer.isActive ? "default" : "destructive"}>
                {customer.isMember ? "Member" : "Non Member"}
              </Badge>
              {customer.gender && (
                <Badge variant="secondary">{GENDER_LABELS[customer.gender]}</Badge>
              )}
              {customer.code && (
                <Badge variant="secondary">{customer.code}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <DeleteCustomerDialog customer={customer}>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DeleteCustomerDialog>
          <EditCustomerDialog customer={customer}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </EditCustomerDialog>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(customer.visitHistory?.totalSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.visitHistory?.totalVisits || 0}</div>
            <p className="text-xs text-muted-foreground">
              {customer.visitHistory?.lastVisit && `Last: ${formatDate(customer.visitHistory.lastVisit)}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.loyaltyPoints?.available || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total earned: {customer.loyaltyPoints?.total || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Bill Value</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.visitHistory?.totalVisits > 0
                ? formatCurrency(
                  (customer.visitHistory?.totalSpent || 0) / customer.visitHistory.totalVisits
                )
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">Per visit</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        {/* <TabsList> */}
        {/* <TabsTrigger value="profile">Profile</TabsTrigger> */}
        {/* <TabsTrigger value="history">History</TabsTrigger> */}
        {/* <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger> */}
        {/* </TabsList> */}

        {/* <TabsContent value="profile" className="space-y-4"> */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{customer.name}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.gender ? GENDER_LABELS[customer.gender] : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Age</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.dateOfBirth ? `${calculateAge(customer.dateOfBirth)} years` : "Not specified"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Franchise</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.franchiseId.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.address?.street && `${customer.address.street}, `}
                      {customer.address?.city && `${customer.address.city}, `}
                      {customer.address?.state} {customer.address?.pincode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Loyalty Information */}
          {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Points Earned</span>
                  <span className="font-medium">{customer.loyaltyPoints?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Points</span>
                  <span className="font-medium text-green-600">{customer.loyaltyPoints?.available || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points Redeemed</span>
                  <span className="font-medium text-red-600">{customer.loyaltyPoints?.redeemed || 0}</span>
                </div>
              </CardContent>
            </Card> */}

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Customer Since</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.visitHistory?.firstVisit
                      ? formatDate(customer.visitHistory.firstVisit)
                      : formatDate(customer.createdAt)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Account Status</p>
                  <Badge variant={customer.isActive ? "default" : "destructive"}>
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(customer.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        {/* </TabsContent> */}

        {/* <TabsContent value="history" className="space-y-4">
          <CustomerHistoryTable customerId={customer._id} history={customerHistory} loading={loading} />
        </TabsContent> */}

        {/* <TabsContent value="preferences" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Preferred Services</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.preferences?.preferredServices?.length > 0
                        ? `${customer.preferences.preferredServices.length} services selected`
                        : "No preferences set"}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium">Preferred Staff</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.preferences?.preferredStaff?.length > 0
                        ? `${customer.preferences.preferredStaff.length} staff members selected`
                        : "No preferences set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {customer.preferences?.notes || "No notes available"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Visit Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customer.visitHistory?.totalVisits > 0 && customer.visitHistory?.firstVisit
                    ? Math.round(customer.visitHistory.totalVisits /
                      Math.max(1, Math.ceil((new Date() - new Date(customer.visitHistory.firstVisit)) /
                        (30 * 24 * 60 * 60 * 1000))))
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">visits per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customer.visitHistory?.firstVisit
                    ? Math.ceil(
                      (new Date() - new Date(customer.visitHistory.firstVisit)) / (30 * 24 * 60 * 60 * 1000)
                    )
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">months</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points Redemption Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customer.loyaltyPoints?.total > 0
                    ? Math.round(
                      ((customer.loyaltyPoints?.redeemed || 0) / customer.loyaltyPoints.total) * 100
                    )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">of total points</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
