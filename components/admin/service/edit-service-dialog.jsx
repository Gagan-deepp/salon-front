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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { updateService } from "@/lib/actions/service_action"
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

export function EditServiceDialog({ children, service }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState(service.allowedRoles || [])
  const router = useRouter()

  const handleRoleChange = (roleValue, checked) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleValue])
    } else {
      setSelectedRoles(selectedRoles.filter((role) => role !== roleValue))
    }
  }

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      duration: Number.parseInt(formData.get("duration")),
      price: Number.parseFloat(formData.get("price")),
      gstRate: Number.parseFloat(formData.get("gstRate")),
      isActive: formData.get("isActive") === "on",
      allowedRoles: selectedRoles,
      commissionRate: Number.parseFloat(formData.get("commissionRate")),
    }

    const result = await updateService(service._id, payload)

    if (result.success) {
      toast.success("Service updated successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to update service")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>Update service information and settings.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input id="name" name="name" defaultValue={service.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={service.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={service.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                defaultValue={service.duration}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service.price}
                required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                name="gstRate"
                type="number"
                min="0"
                max="28"
                defaultValue={service.gstRate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="50"
                defaultValue={service.commissionRate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed Roles *</Label>
            <div className="grid grid-cols-3 gap-4">
              {ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) => handleRoleChange(role.value, checked)} />
                  <Label htmlFor={role.value} className="text-sm">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={service.isActive} />
            <Label htmlFor="isActive">Active Status</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || selectedRoles.length === 0}>
              {loading ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
