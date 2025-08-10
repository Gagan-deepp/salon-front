"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Eye, MoreHorizontal, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CATEGORIES = [
  { value: "HAIR_CUT", label: "Hair Cut" },
  { value: "HAIR_COLOR", label: "Hair Color" },
  { value: "FACIAL", label: "Facial" },
  { value: "MASSAGE", label: "Massage" },
  { value: "MANICURE", label: "Manicure" },
  { value: "PEDICURE", label: "Pedicure" },
  { value: "THREADING", label: "Threading" },
  { value: "WAXING", label: "Waxing" },
  { value: "BRIDAL", label: "Bridal" },
  { value: "OTHER", label: "Other" },
]

const ROLES = [
  { value: "STYLIST", label: "Stylist" },
  { value: "THERAPIST", label: "Therapist" },
  { value: "MANAGER", label: "Manager" },
]

export function ServiceTable({ services }) {
  const router = useRouter()

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No Services found.</p>
        </CardContent>
      </Card>
    );
  }


  const handleView = (serviceId) => {
    router.push(`/admin/services/${serviceId}`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  const getCategoryLabel = (category) => {
    return CATEGORIES.find((cat) => cat.value === category)?.label || category;
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-4">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleView(service._id)}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{service.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryLabel(service.category)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatDuration(service.duration)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatCurrency(service.price)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {service.allowedRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {ROLES.find((r) => r.value === role)?.label || role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={service.isActive ? "default" : "destructive"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{service.commissionRate}%</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleView(service._id)
                        }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
