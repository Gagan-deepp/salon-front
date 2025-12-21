"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Gift, User, Scissors, AlertCircle, CheckCircle, Package as PackageIcon } from "lucide-react"
import { getAllCustomers, getCustomers, getCustomersDropdown } from "@/lib/actions/customer_action"
import { getServices } from "@/lib/actions/service_action"
import { getCustomerPackages, checkBalance, redeemFromPackage } from "@/lib/actions/customer_package_actions"
import { toast } from "sonner"

// Separate component to handle searchParams
function RedeemPackageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedCustomerId = searchParams?.get("customerId") || ""

  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [customerPackages, setCustomerPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState("")
  const [balanceInfo, setBalanceInfo] = useState(null)

  const [formData, setFormData] = useState({
    customerId: preSelectedCustomerId,
    serviceId: "",
    quantity: "1"
  })

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    fetchCustomers()
    fetchServices()
  }, [])

  useEffect(() => {
    if (formData.customerId && Array.isArray(customers) && customers.length > 0) {
      const customer = customers.find((c) => c._id === formData.customerId)
      setSelectedCustomer(customer)
      fetchCustomerPackages(formData.customerId)
    }
  }, [formData.customerId, customers])

  useEffect(() => {
    if (formData.serviceId && Array.isArray(services) && services.length > 0) {
      const service = services.find((s) => s._id === formData.serviceId)
      setSelectedService(service)
    }
  }, [formData.serviceId, services])

  useEffect(() => {
    if (formData.customerId && formData.serviceId) {
      checkServiceBalance()
    }
  }, [formData.customerId, formData.serviceId, formData.quantity])

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers({})
      console.log('Customers response:', response)
      
      // Handle different response structures
      const customersData = response.data?.customers || response.data || []
      console.log('Customers data:', customersData, 'Is array:', Array.isArray(customersData))
      
      setCustomers(Array.isArray(customersData) ? customersData : [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error("Failed to load customers")
      setCustomers([])
    }
  }

  const fetchServices = async () => {
    try {
      const response = await getServices({})
      console.log('Services response:', response)
      
      // Handle different response structures
      const servicesData = response.data?.services || response.data || []
      console.log('Services data:', servicesData, 'Is array:', Array.isArray(servicesData))
      
      setServices(Array.isArray(servicesData) ? servicesData : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error("Failed to load services")
      setServices([])
    }
  }

  const fetchCustomerPackages = async (customerId) => {
    try {
      const response = await getCustomerPackages(customerId)
      console.log('Customer packages response:', response)
      
      const packagesData = response.data?.packages || []
      console.log('Packages data:', packagesData, 'Is array:', Array.isArray(packagesData))
      
      setCustomerPackages(Array.isArray(packagesData) ? packagesData : [])
    } catch (error) {
      console.error("Error fetching packages:", error)
      setCustomerPackages([])
    }
  }

  const checkServiceBalance = async () => {
    try {
      const response = await checkBalance(
        formData.customerId,
        formData.serviceId,
        parseInt(formData.quantity)
      )
      console.log('Balance check response:', response)
      setBalanceInfo(response.data)
    } catch (error) {
      console.error('Balance check error:', error)
      setBalanceInfo(null)
    }
  }

  const handleRedeem = async () => {
    if (!formData.customerId || !formData.serviceId) {
      toast.error("Please select customer and service")
      return
    }

    if (!balanceInfo?.canRedeem) {
      toast.error("Insufficient package balance")
      return
    }

    setLoading(true)
    try {
      const payload = {
        customerId: formData.customerId,
        serviceId: formData.serviceId,
        quantity: parseInt(formData.quantity)
      }

      await redeemFromPackage(payload)
      toast.success("Service redeemed successfully!")
      
      // Refresh packages
      fetchCustomerPackages(formData.customerId)
      
      // Reset service selection
      setFormData({ ...formData, serviceId: "", quantity: "1" })
      setSelectedService(null)
      setBalanceInfo(null)
    } catch (error) {
      console.error('Redeem error:', error)
      toast.error(error.response?.data?.message || "Failed to redeem service")
    } finally {
      setLoading(false)
    }
  }

  // Safe filter with array check
  const filteredCustomers = Array.isArray(customers) 
    ? customers.filter((c) =>
        c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        c.phone?.includes(searchCustomer)
      )
    : []

  const activePackages = Array.isArray(customerPackages)
    ? customerPackages.filter((p) => p.status === "ACTIVE")
    : []

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
            <Gift className="w-8 h-8 text-primary" />
            Redeem Package
          </h1>
          <p className="text-gray-600 mt-1">Use customer&apos;s package balance to redeem services</p>
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
                      {filteredCustomers.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No customers found</div>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))
                      )}
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Packages */}
            {formData.customerId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PackageIcon className="w-5 h-5 text-primary" />
                    Active Packages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activePackages.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No active packages found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => router.push(`/packages/purchase?customerId=${formData.customerId}`)}
                      >
                        Purchase Package
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activePackages.map((pkg) => (
                        <div key={pkg._id} className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-gray-900">{pkg.packageId?.name || "Package"}</p>
                              <p className="text-sm text-gray-600" suppressHydrationWarning>
                                Expires: {new Date(pkg.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="bg-green-600">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200">
                            <span className="text-sm text-gray-700">Available Balance</span>
                            <span className="text-2xl font-bold text-green-600">₹{pkg.remainingValue?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Service Selection */}
            {activePackages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-primary" />
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="service">Service *</Label>
                      <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(services) && services.length > 0 ? (
                            services.map((service) => (
                              <SelectItem key={service._id} value={service._id}>
                                {service.name} - ₹{service.price?.toLocaleString() || 0}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">No services available</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                  </div>

                  {selectedService && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-bold text-gray-900 mb-2">{selectedService.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price per service</span>
                        <span className="font-semibold">₹{selectedService.price?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-primary">
                          ₹{((selectedService.price || 0) * parseInt(formData.quantity || "1")).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Balance Check */}
                  {balanceInfo && (
                    <div className={`p-4 rounded-lg border ${
                      balanceInfo.canRedeem 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    }`}>
                      {balanceInfo.canRedeem ? (
                        <div className="flex items-start gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Sufficient Balance</p>
                            <p className="text-sm">
                              Available: ₹{balanceInfo.availableBalance?.toLocaleString() || 0} | 
                              Required: ₹{balanceInfo.requiredValue?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-red-800">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Insufficient Balance</p>
                            <p className="text-sm">{balanceInfo.message || "Not enough balance in package"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Redemption Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Customer</span>
                    <span className="font-semibold">{selectedCustomer?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold">{selectedService?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-semibold">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Service Value</span>
                    <span className="font-semibold">
                      ₹{selectedService ? ((selectedService.price || 0) * parseInt(formData.quantity)).toLocaleString() : "0"}
                    </span>
                  </div>
                  {balanceInfo && balanceInfo.canRedeem && (
                    <div className="flex justify-between py-3 bg-green-50 px-3 rounded-lg">
                      <span className="font-bold text-gray-900">Remaining Balance</span>
                      <span className="font-bold text-green-600 text-xl">
                        ₹{((balanceInfo.availableBalance || 0) - (balanceInfo.requiredValue || 0)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRedeem}
                  disabled={loading || !balanceInfo?.canRedeem}
                >
                  {loading ? "Redeeming..." : "Redeem Service"}
                </Button>

                {!balanceInfo?.canRedeem && formData.serviceId && (
                  <p className="text-sm text-center text-red-600">
                    Cannot redeem: Insufficient balance
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function RedeemPackagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="container mx-auto max-w-5xl">
          <Card className="animate-pulse">
            <CardContent className="pt-12 pb-12">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <RedeemPackageContent />
    </Suspense>
  )
}
