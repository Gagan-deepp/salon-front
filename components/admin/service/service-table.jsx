"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Eye, Edit, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const router = useRouter()

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !categoryFilter || service.category === categoryFilter

    const matchesRole = !roleFilter || service.allowedRoles.includes(roleFilter)

    return matchesSearch && matchesCategory && matchesRole
  })

  const handleView = (serviceId) => {
    router.push(`/admin/services/${serviceId}`)
  }

  const handleEdit = (serviceId) => {
    router.push(`/admin/services/${serviceId}/edit`)
  }

  const handleDelete = (serviceId) => {
    toast.success("Service deleted successfully")
    router.refresh()
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

  const handleCategoryChange = (value) => {
    setCategoryFilter(value === "all" ? "" : value)
  }

  const handleRoleChange = (value) => {
    setRoleFilter(value === "all" ? "" : value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8" />
        </div>
        <Select value={categoryFilter || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter || "all"} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
            {filteredServices.map((service) => (
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(service._id)
                        }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(service._id)
                        }}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
