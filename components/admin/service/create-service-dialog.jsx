"use client"

import { useState, useEffect } from "react"
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
import { createService } from "@/lib/actions/service_action"
import { getFranchises } from "@/lib/actions/franchise_action"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const CATEGORIES = [
  { value: "Hair", label: "Hair" },
  { value: "Skin", label: "Skin" },
  { value: "Nails", label: "Nails" },
  { value: "Makeup", label: "Makeup" },
  { value: "Spa", label: "Spa" },
  { value: "Body_Care", label: "Body Care" },
  { value: "Others", label: "Others" },
]

const ROLES = [
  { value: "STYLIST", label: "Stylist" },
  { value: "THERAPIST", label: "Therapist" },
  { value: "MANAGER", label: "Manager" },
]

async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export function CreateServiceDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [franchises, setFranchises] = useState([])
  const [inclusiveGST, setInclusiveGST] = useState(false) // New state for GST toggle
  const router = useRouter()
  const { data: session } = useSession()


  useEffect(() => {
    const loadFranchises = async () => {
      const franchiseList = await fetchFranchises()
      setFranchises(franchiseList)
    }
    if (open) {
      loadFranchises()
    }
  }, [open])

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
      type: formData.get("type"),
      description: formData.get("description"),
      duration: Number.parseInt(formData.get("duration")),
      price: Number.parseFloat(formData.get("price")),
      // Only include gstRate if not inclusive
      gstRate: Number.parseFloat(formData.get("gstRate")),
      inclusiveGST: inclusiveGST,
      franchiseId: formData.get("franchiseId"),
      allowedRoles: selectedRoles,
      commissionRate: Number.parseFloat(formData.get("commissionRate")),
    }

    const result = await createService(payload)

    if (result.success) {
      toast.success("Service created successfully")
      setOpen(false)
      setSelectedRoles([])
      setInclusiveGST(false) // Reset toggle
      router.refresh()
    } else {
      toast.error(result.error || "Failed to create service")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>Add a new service to your offerings.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input id="name" name="name" required placeholder="Enter service name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical"> Technical </SelectItem>
                  <SelectItem value="non-technical"> Non Technical </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} placeholder="Enter service description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="franchiseId">Franchise *</Label>
            {/* <Select name="franchiseId" required>
              <SelectTrigger >
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchises.map((franchise) => (
                  <SelectItem key={franchise._id} value={franchise._id}>
                    {franchise.name} ({franchise.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}



            <Select name="franchiseId" required value={session?.franchiseId || ""}>
              <SelectTrigger className="w-full" disabled={session?.user?.role === "FRANCHISE_OWNER"}>
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchises.map((franchise) => (
                  <SelectItem key={franchise._id} value={franchise._id}>
                    {franchise.name} ({franchise.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input id="duration" name="duration" type="number" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" required />
            </div>
          </div>

          {/* GST Section with Toggle */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">

                <p className="text-sm text-gray-500">
                  {inclusiveGST
                    ? "Price already includes GST (no additional GST will be charged)"
                    : "GST will be added on top of the price"}
                </p>
              </div>
              <Switch
                id="inclusiveGST"
                checked={inclusiveGST}
                onCheckedChange={setInclusiveGST}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%) *</Label>
              <Input
                id="gstRate"
                name="gstRate"
                type="number"
                min="0"
                max="28"
                step="0.01"
                defaultValue="18"
                required={!inclusiveGST}
                className="bg-white"
              />
              {/* <p className="text-xs text-gray-500">
                  This GST rate will be added on top of the base price
                </p> */}
            </div>


            {inclusiveGST && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                <strong>Note:</strong> The entered price already includes GST. No additional GST will be calculated at billing.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="commissionRate">Commission Rate (%)</Label>
            <Input
              id="commissionRate"
              name="commissionRate"
              type="number"
              min="0"
              max="50"
              step="0.01"
              defaultValue="10"
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Allowed Roles *</Label>
            <div className="grid grid-cols-3 gap-4">
              {ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) => handleRoleChange(role.value, checked)}
                  />
                  <Label htmlFor={role.value} className="text-sm">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
