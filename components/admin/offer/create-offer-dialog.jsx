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
import { createOffer } from "@/lib/actions/offer_action"

export function CreateOfferDialog({ children }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const offerData = {
        offerCode: formData.get("offerCode").toUpperCase(),
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

      const result = await createOffer(offerData)
      
      if (result.success) {
        toast.success("Offer created successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create offer")
      }
    } catch (error) {
      toast.error("An error occurred while creating the offer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
          <DialogDescription>
            Create a new promotional offer or discount code
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerCode">Offer Code *</Label>
                <Input
                  id="offerCode"
                  name="offerCode"
                  placeholder="WELCOME25"
                  required
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerType">Offer Type *</Label>
                <Select name="offerType" defaultValue="PERCENTAGE" required>
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

            <div className="space-y-2">
              <Label htmlFor="name">Offer Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Welcome Offer - 25% Off"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Get 25% off on your first visit"
                rows={3}
              />
            </div>
          </div>

          {/* Discount Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Discount Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select name="discountType" defaultValue="PERCENTAGE" required>
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
                  placeholder="25"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Max Discount Amount (Optional)</Label>
              <Input
                id="maxDiscountAmount"
                name="maxDiscountAmount"
                type="number"
                placeholder="500"
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" name="isActive" defaultChecked />
              <Label htmlFor="isActive">Active immediately</Label>
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
                  placeholder="100 (Leave empty for unlimited)"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="perUserLimit">Per User Limit *</Label>
                <Input
                  id="perUserLimit"
                  name="perUserLimit"
                  type="number"
                  defaultValue="1"
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
                  placeholder="500"
                  defaultValue="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicableOn">Applicable On</Label>
                <Select name="applicableOn" defaultValue="ALL">
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
              <Switch id="firstTimeCustomersOnly" name="firstTimeCustomersOnly" />
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
              {loading ? "Creating..." : "Create Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
