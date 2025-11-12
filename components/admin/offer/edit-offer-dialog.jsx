"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updateOffer } from "@/lib/actions/offer_action"

export function EditOfferDialog({ offer, children }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const offerData = {
        name: formData.get("name"),
        description: formData.get("description"),
        offerType: formData.get("offerType"),
        discount: {
          type: formData.get("discountType"),
          value: parseFloat(formData.get("discountValue")),
          maxDiscountAmount: formData.get("maxDiscountAmount") 
            ? parseFloat(formData.get("maxDiscountAmount")) 
            : null
        },
        validity: {
          startDate: new Date(formData.get("startDate")),
          endDate: new Date(formData.get("endDate")),
          isActive: formData.get("isActive") === "on"
        },
        usageLimits: {
          totalUsageLimit: formData.get("totalUsageLimit") 
            ? parseInt(formData.get("totalUsageLimit")) 
            : null,
          perUserLimit: parseInt(formData.get("perUserLimit") || 1)
        },
        conditions: {
          minPurchaseAmount: parseFloat(formData.get("minPurchaseAmount") || 0),
          applicableOn: formData.get("applicableOn") || "ALL",
          firstTimeCustomersOnly: formData.get("firstTimeCustomersOnly") === "on"
        }
      }

      const result = await updateOffer(offer._id, offerData)
      
      if (result.success) {
        toast.success("Offer updated successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update offer")
      }
    } catch (error) {
      toast.error("An error occurred while updating the offer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Offer</DialogTitle>
          <DialogDescription>
            Update offer details and configuration
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Offer Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={offer.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={offer.description}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerType">Offer Type *</Label>
              <Select name="offerType" defaultValue={offer.offerType} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage Off</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  <SelectItem value="BUY_X_GET_Y">Buy X Get Y</SelectItem>
                  <SelectItem value="FREE_SERVICE">Free Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Discount Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select name="discountType" defaultValue={offer.discount.type} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  defaultValue={offer.discount.value}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Max Discount Amount</Label>
              <Input
                id="maxDiscountAmount"
                name="maxDiscountAmount"
                type="number"
                defaultValue={offer.discount.maxDiscountAmount}
                min="0"
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Validity Period</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  defaultValue={formatDateTimeLocal(offer.validity.startDate)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  defaultValue={formatDateTimeLocal(offer.validity.endDate)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                name="isActive" 
                defaultChecked={offer.validity.isActive} 
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Usage Limits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
                <Input
                  id="totalUsageLimit"
                  name="totalUsageLimit"
                  type="number"
                  defaultValue={offer.usageLimits.totalUsageLimit}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="perUserLimit">Per User Limit *</Label>
                <Input
                  id="perUserLimit"
                  name="perUserLimit"
                  type="number"
                  defaultValue={offer.usageLimits.perUserLimit}
                  required
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Conditions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPurchaseAmount">Min Purchase Amount</Label>
                <Input
                  id="minPurchaseAmount"
                  name="minPurchaseAmount"
                  type="number"
                  defaultValue={offer.conditions.minPurchaseAmount}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicableOn">Applicable On</Label>
                <Select name="applicableOn" defaultValue={offer.conditions.applicableOn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Items</SelectItem>
                    <SelectItem value="SERVICES_ONLY">Services Only</SelectItem>
                    <SelectItem value="PRODUCTS_ONLY">Products Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="firstTimeCustomersOnly" 
                name="firstTimeCustomersOnly" 
                defaultChecked={offer.conditions.firstTimeCustomersOnly}
              />
              <Label htmlFor="firstTimeCustomersOnly">First-time customers only</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
