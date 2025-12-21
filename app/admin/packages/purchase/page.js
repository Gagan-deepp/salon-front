"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, ShoppingCart, Calendar, DollarSign, CheckCircle, User, Package as PackageIcon } from "lucide-react"
import { getPackages } from "@/lib/actions/package_actions"
import { getCustomers } from "@/lib/actions/customer_actions"
import { purchasePackage } from "@/lib/actions/customer_package_actions"
import { toast } from "sonner"

export default function PurchasePackagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedCustomerId = searchParams.get("customerId")
  const preSelectedPackageId = searchParams.get("packageId")

  const [mounted, setMounted] = useState(false)
  const [packages, setPackages] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState("")
  
  const [formData, setFormData] = useState({
    customerId: preSelectedCustomerId || "",
    packageId: preSelectedPackageId || "",
    amount: "",
    paymentMode: "CASH",
    notes: ""
  })

  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPackages()
      fetchCustomers()
    }
  }, [mounted])

  useEffect(() => {
    if (formData.packageId) {
      const pkg = packages.find((p) => p._id === formData.packageId)
      setSelectedPackage(pkg)
      if (pkg) {
        setFormData({ ...formData, amount: pkg.price.toString() })
      }
    }
  }, [formData.packageId, packages])

  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find((c) => c._id === formData.customerId)
      setSelectedCustomer(customer)
    }
  }, [formData.customerId, customers])

  const fetchPackages = async () => {
    try {
      const response = await getPackages({ activeOnly: true })
      setPackages(response.data || [])
    } catch (error) {
      toast.error("Failed to load packages")
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers({})
      setCustomers(response.data || [])
    } catch (error) {
      toast.error("Failed to load customers")
    }
  }

  const handlePurchase = async () => {
    if (!formData.customerId || !formData.packageId) {
      toast.error("Please select customer and package")
      return
    }

    setLoading(true)
    try {
      const payload = {
        customerId: formData.customerId,
        packageId: formData.packageId,
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
        notes: formData.notes || undefined
      }

      await purchasePackage(payload)
      toast.success("Package purchased successfully!")
      router.push(`/customers/${formData.customerId}/packages`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to purchase package")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone?.includes(searchCustomer)
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Purchase Package
          </h1>
          <p className="text-gray-600 mt-1">Select customer and package to complete purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Select Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerSearch">Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="customerSearch"
                      placeholder="Search by name or phone..."
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customer">Customer *</Label>
                  <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCustomers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {selectedCustomer.name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Phone:</strong> {selectedCustomer.phone}
                    </p>
                    {selectedCustomer.email && (
                      <p className="text-sm text-gray-700">
                        <strong>Email:</strong> {selectedCustomer.email}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Package Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-primary" />
                  Select Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="package">Package *</Label>
                  <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg._id}>
                          {pkg.name} - ₹{pkg.price.toLocaleString()} ({pkg.type.replace("_", " ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPackage && (
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-lg text-gray-900">{selectedPackage.name}</p>
                        <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedPackage.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600">Price</p>
                        <p className="text-xl font-bold text-primary">₹{selectedPackage.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Value</p>
                        <p className="text-xl font-bold text-green-600">₹{selectedPackage.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Validity</p>
                        <p className="text-xl font-bold text-gray-900">{selectedPackage.validityDays} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMode">Payment Mode *</Label>
                    <Select value={formData.paymentMode} onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes or comments..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Customer</span>
                    <span className="font-semibold">{selectedCustomer?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Package</span>
                    <span className="font-semibold">{selectedPackage?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Package Value</span>
                    <span className="font-semibold text-green-600">
                      ₹{selectedPackage?.totalValue?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="font-semibold">{formData.paymentMode}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-primary/10 px-3 rounded-lg">
                    <span className="font-bold text-gray-900">Amount to Pay</span>
                    <span className="font-bold text-primary text-xl">
                      ₹{parseFloat(formData.amount || "0").toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedPackage && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Customer will get ₹{selectedPackage.totalValue?.toLocaleString()} worth of services valid for {selectedPackage.validityDays} days</span>
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={loading || !formData.customerId || !formData.packageId || !formData.amount}
                >
                  {loading ? "Processing..." : "Complete Purchase"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
