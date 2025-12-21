"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Tag, Eye } from "lucide-react"

export default function PackageCard({ package: pkg, onUpdate }) {
  const router = useRouter()

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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
              {pkg.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {pkg.description || "No description"}
            </p>
          </div>
          <Badge className={getTypeBadgeColor(pkg.type)}>
            {pkg.type.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg">
          <div>
            <p className="text-xs text-gray-600">Price</p>
            <p className="text-2xl font-bold text-primary">₹{pkg.price?.toLocaleString()}</p>
          </div>
          {pkg.bonusValue > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-600">Total Value</p>
              <p className="text-xl font-bold text-green-600">₹{pkg.totalValue?.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Valid for {pkg.validityDays} days</span>
          </div>
          {pkg.servicesIncluded?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              <span>{pkg.servicesIncluded.length} services included</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge variant={pkg.isActive ? "default" : "secondary"}>
            {pkg.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/packages/${pkg._id}`)}
            className="text-primary hover:text-primary/80"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
