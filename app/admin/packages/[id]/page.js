"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, DollarSign, Tag, Edit, Trash2, CheckCircle } from "lucide-react"
import { getPackageById, deletePackage } from "@/lib/actions/package_actions"
import { toast } from "sonner"

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("params.id",params.id)
    fetchPackage()
  }, [params.id])

  const fetchPackage = async () => {
    try {
      console.log("================================")
      const response = await getPackageById(params.id)
      setPkg(response.data)
    } catch (error) {
      toast.error("Failed to load package")
      router.push("/packages")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      await deletePackage(params.id)
      toast.success("Package deleted successfully")
      router.push("/packages")
    } catch (error) {
      toast.error("Failed to delete package")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="animate-pulse">
            <CardContent className="pt-12 pb-12 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // if (!pkg) return null

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "VALUE_BASED": 
        return "bg-blue-100 text-blue-800"
      case "SERVICE_BASED": 
        return "bg-purple-100 text-purple-800"
      case "MEMBERSHIP": 
        return "bg-orange-100 text-orange-800"
      default: 
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{pkg.name}</h1>
                <Badge className={getTypeBadgeColor(pkg.type)}>
                  {pkg.type.replace("_", " ")}
                </Badge>
                <Badge variant={pkg.isActive ? "default" : "secondary"}>
                  {pkg.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-gray-600">{pkg.description || "No description provided"}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Pricing Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-3xl font-bold text-primary">₹{pkg.price?.toLocaleString()}</p>
              </div>
              {pkg.bonusValue > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Bonus Value</p>
                  <p className="text-3xl font-bold text-green-600">₹{pkg.bonusValue?.toLocaleString()}</p>
                </div>
              )}
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-secondary">₹{pkg.totalValue?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Validity Period</span>
              <span className="font-semibold">{pkg.validityDays} days</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600">Package Type</span>
              <span className="font-semibold">{pkg.type.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Services Included</span>
              <span className="font-semibold">{pkg.servicesIncluded?.length || 0} services</span>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        {pkg.servicesIncluded?.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Included Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pkg.servicesIncluded.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {service.serviceId?.name || "Service"}
                      </p>
                      {service.count && (
                        <p className="text-sm text-gray-600">{service.count} sessions</p>
                      )}
                    </div>
                    {service.value && (
                      <Badge variant="outline">₹{service.value.toLocaleString()}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {pkg.benefits?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Package Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {pkg.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
