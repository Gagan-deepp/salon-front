"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Package, Gift, Calendar, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { getCustomerPackages, redeemPackage } from "@/lib/actions/package_actions"

export function PackageRedemptionDialog({ customerId, services, onRedemptionSuccess, children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Fetch customer packages when dialog opens
  useEffect(() => {
    if (open && customerId) {
      fetchCustomerPackages()
    }
  }, [open, customerId])

  const fetchCustomerPackages = async () => {
    setLoading(true)
    try {
      const result = await getCustomerPackages(customerId)
      console.log("result-=-=-=-=-", result)
      if (result.success && result.data?.data) {
        // Filter only active packages with remaining sessions
        const activePackages = result.data.data.packages
        console.log("active Packages", activePackages)
        setPackages(activePackages)
      } else {
        toast.error(result.error || "Failed to fetch packages")
      }
    } catch (error) {
      toast.error("Error fetching packages")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async () => {
    console.log("came hers", selectedPackage, selectedService, quantity)

    if (!selectedPackage || !selectedService || quantity < 1) {
      toast.error("Please fill all fields")
      return
    }



    const pkg = packages.find((p) => p._id === selectedPackage)
    const service = services.find((s) => s._id === selectedService)

    if (!pkg || !service) {
      toast.error("Invalid package or service selected")
      return
    }

    if (quantity > pkg.remainingSessions) {
      toast.error(`Only ${pkg.remainingSessions} sessions remaining`)
      return
    }

    setLoading(true)
    try {
      const payload = {
        customerId,
        serviceId: selectedService,
        quantity: quantity,
        serviceValue: service.price * quantity,
      }

      const result = await redeemPackage(payload)

      if (result.success) {
        toast.success(`Package redeemed successfully! ${quantity} session(s) used.`)

        // Call parent callback with redeemed service details
        if (onRedemptionSuccess) {
          onRedemptionSuccess({
            serviceId: selectedService,
            serviceName: service.name,
            price: 0, // Price is 0 because it's redeemed from package
            quantity: quantity,
            duration: service.duration,
            gstRate: 0,
            providerId: "",
            providerName: "",
            isPackageRedemption: true,
            packageId: selectedPackage,
            packageName: pkg.packageId?.name || "Package",
          })
        }

        // Reset and close
        setSelectedPackage("")
        setSelectedService("")
        setQuantity(1)
        setOpen(false)
      } else {
        toast.error(result.error || "Failed to redeem package")
      }
    } catch (error) {
      toast.error("Error redeeming package")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const selectedPackageData = packages.find((p) => p._id === selectedPackage)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Redeem Package
          </DialogTitle>
          <DialogDescription>
            Select a package and service to redeem from customer's active packages
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {loading && !packages.length ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">No Active Packages</p>
                <p className="text-sm text-gray-500">This customer has no packages to redeem</p>
              </div>
            ) : (
              <>
                {/* Package Selection */}
                    <div className="space-y-2 mb-8">
                  <Label htmlFor="package">Select Package *</Label>
                  <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                        <SelectTrigger className="w-full" >
                      <SelectValue placeholder="Choose a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg._id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex-1">
                              <p className="font-medium">{pkg.packageId?.name || "Package"}</p>
                              <p className="text-xs">
                                Remaining Balance : {formatCurrency(pkg.remainingValue)}
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {pkg.packageId?.packageType || "Service"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Details */}
                {/* {selectedPackageData && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-blue-900">
                        {selectedPackageData.packageId?.name || "Package"}
                      </h4>
                      <Badge variant={selectedPackageData.status === "active" ? "default" : "secondary"}>
                        {selectedPackageData.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Sessions:</p>
                        <p className="font-medium">{selectedPackageData.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Remaining:</p>
                        <p className="font-medium text-green-600">
                          {selectedPackageData.remainingSessions}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Validity:</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedPackageData.validUntil).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Discount:</p>
                        <p className="font-medium">{selectedPackageData.packageId?.discount || 0}%</p>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="w-full" >
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-xs">₹{service.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Sessions) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={selectedPackageData?.remainingSessions || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    placeholder="Enter quantity"
                  />
                  {selectedPackageData && quantity > selectedPackageData.remainingSessions && (
                    <p className="text-sm text-red-600">
                      Maximum {selectedPackageData.remainingSessions} sessions available
                    </p>
                  )}
                </div>

                {/* Redemption Summary */}
                {selectedService && selectedPackageData && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Redemption Summary</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Service:</span>{" "}
                        {services.find((s) => s._id === selectedService)?.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span> {quantity} session(s)
                      </p>
                      <p className="text-gray-700">
                        {/* <span className="font-medium">Remaining after redemption:</span>{" "} */}
                        {/* {selectedPackageData.remainingSessions - quantity} session(s) */}
                      </p>
                      <p className="text-lg font-semibold text-green-700 mt-2">
                        Amount: ₹0 (Free from package)
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRedeem}
            disabled={!selectedPackage || !selectedService || loading || quantity < 1}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redeeming...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 mr-2" />
                Redeem Package
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
