"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  BarChart3
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { deleteOffer } from "@/lib/actions/offer_action"

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

export function OfferTable({ offers, pagination }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState(null)

  const handleView = (offerId) => {
    router.push(`/admin/offers/${offerId}`)
  }

  const handleEdit = (offerId) => {
    router.push(`/admin/offers/${offerId}/edit`)
  }

  const handleDelete = async (offerId, offerCode) => {
    if (!confirm(`Are you sure you want to delete offer "${offerCode}"?`)) {
      return
    }

    setDeletingId(offerId)
    try {
      const result = await deleteOffer(offerId)
      if (result.success) {
        toast.success("Offer deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete offer")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the offer")
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyCode = (offerCode) => {
    navigator.clipboard.writeText(offerCode)
    toast.success(`Offer code "${offerCode}" copied to clipboard`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatDiscount = (offer) => {
    if (offer.discount.type === "PERCENTAGE") {
      return `${offer.discount.value}% OFF`
    } else {
      return `₹${offer.discount.value} OFF`
    }
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No offers found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first offer to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-blue-600">
                      {offer.offerCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(offer.offerCode)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{offer.name}</p>
                    {offer.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {offer.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {offerTypeLabels[offer.offerType]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">
                    {formatDiscount(offer)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{formatDate(offer.validity.startDate)}</p>
                    <p className="text-gray-500">to {formatDate(offer.validity.endDate)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">
                      {offer.usageLimits.currentUsageCount}
                      {offer.usageLimits.totalUsageLimit 
                        ? ` / ${offer.usageLimits.totalUsageLimit}` 
                        : " / ∞"}
                    </p>
                    {offer.usageLimits.totalUsageLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${Math.min((offer.usageLimits.currentUsageCount / offer.usageLimits.totalUsageLimit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[offer.status]}>
                    {offer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(offer._id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/offers/${offer._id}/statistics`)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Statistics
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleEdit(offer._id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(offer._id, offer.offerCode)}
                        className="text-red-600"
                        disabled={deletingId === offer._id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === offer._id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} offers
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/offers?page=${pagination.page - 1}`)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/offers?page=${pagination.page + 1}`)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
