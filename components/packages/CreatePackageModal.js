"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import { createPackage } from "@/lib/actions/package_actions"
import { getServices } from "@/lib/actions/service_action"
import { toast } from "sonner"

export default function CreatePackageModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "VALUE_BASED",
    price: "",
    bonusValue: "",
    validityDays: "",
    servicesIncluded: [],
    benefits: [""],
    isActive: true
  })

  useEffect(() => {
    if (open) {
      fetchServices()
    }
  }, [open])

  const fetchServices = async () => {
    try {
      const response = await getServices({})
      setServices(response.data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bonusValue: formData.bonusValue ? parseFloat(formData.bonusValue) : 0,
        totalValue: parseFloat(formData.price) + (formData.bonusValue ? parseFloat(formData.bonusValue) : 0),
        validityDays: parseInt(formData.validityDays),
        benefits: formData.benefits.filter(b => b.trim() !== "")
      }

      await createPackage(payload)
      toast.success("Package created successfully!")
      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      toast.error(error.message || "Failed to create package")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "VALUE_BASED",
      price: "",
      bonusValue: "",
      validityDays: "",
      servicesIncluded: [],
      benefits: [""],
      isActive: true
    })
  }

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] })
  }

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    })
  }

  const updateBenefit = (index, value) => {
    const updated = [...formData.benefits]
    updated[index] = value
    setFormData({ ...formData, benefits: updated })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Premium Value Pack"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Get ₹12,000 worth of services for just ₹10,000..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Package Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VALUE_BASED">Value Based</SelectItem>
                    <SelectItem value="SERVICE_BASED">Service Based</SelectItem>
                    <SelectItem value="MEMBERSHIP">Membership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="validityDays">Validity (Days) *</Label>
                <Input
                  id="validityDays"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                  placeholder="180"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="10000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bonusValue">Bonus Value (₹)</Label>
                <Input
                  id="bonusValue"
                  type="number"
                  value={formData.bonusValue}
                  onChange={(e) => setFormData({ ...formData, bonusValue: e.target.value })}
                  placeholder="2000"
                />
              </div>
            </div>

            {formData.price && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Total Value:</strong> ₹
                  {(parseFloat(formData.price || "0") + parseFloat(formData.bonusValue || "0")).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div>
            <Label>Benefits</Label>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Priority booking"
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                <Plus className="w-4 h-4 mr-2" />
                Add Benefit
              </Button>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-sm text-gray-600">Make this package available for purchase</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
