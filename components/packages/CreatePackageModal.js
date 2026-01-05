"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Loader2 } from "lucide-react"
import { createPackage } from "@/lib/actions/package_actions"
import { getServices } from "@/lib/actions/service_action"
import { getFranchises } from "@/lib/actions/franchise_action"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export default function CreatePackageModal({ open, onClose, onSuccess }) {
  const [isPending, startTransition] = useTransition()
  const [services, setServices] = useState([])
  const [franchises, setFranchises] = useState([])
  const [benefits, setBenefits] = useState([""])
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const loadData = async () => {
      if (open) {
        try {
          const [servicesResponse, franchiseList] = await Promise.all([
            getServices({}),
            fetchFranchises()
          ])
          setServices(servicesResponse.data || [])
          setFranchises(franchiseList)
        } catch (error) {
          console.error("Error loading data:", error)
        }
      }
    }
    loadData()
  }, [open])

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const payload = {
        name: formData.get("name"),
        description: formData.get("description"),
        type: formData.get("type"),
        price: parseFloat(formData.get("price")),
        bonusValue: formData.get("bonusValue") ? parseFloat(formData.get("bonusValue")) : 0,
        validityDays: parseInt(formData.get("validityDays")),
        franchiseId: formData.get("franchiseId"),
        isActive: formData.get("isActive") === "on",
        servicesIncluded: [],
        benefits: benefits.filter(b => b.trim() !== "")
      }

      payload.totalValue = payload.price + payload.bonusValue

      const result = await createPackage(payload)

      if (result.success === false) {
        toast.error(result.error || "Failed to create package")
        return
      }

      toast.success("Package created successfully!")
      setBenefits([""])
      onClose()
      router.refresh()
      onSuccess?.()
    })
  }

  const addBenefit = () => {
    setBenefits([...benefits, ""])
  }

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const updateBenefit = (index, value) => {
    const updated = [...benefits]
    updated[index] = value
    setBenefits(updated)
  }



  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Package</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Premium Value Pack"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Get ₹12,000 worth of services for just ₹10,000..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="franchiseId">Franchise *</Label>
              <Select name="franchiseId" required defaultValue={session?.franchiseId || ""}>
                <SelectTrigger disabled={session?.user?.role === "FRANCHISE_OWNER"}>
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
              <div>
                <Label htmlFor="type">Package Type *</Label>
                <Select name="type" required defaultValue="VALUE_BASED">
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
                  name="validityDays"
                  type="number"
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
                  name="price"
                  type="number"
                  placeholder="10000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bonusValue">Bonus Value (₹)</Label>
                <Input
                  id="bonusValue"
                  name="bonusValue"
                  type="number"
                  placeholder="2000"
                  defaultValue="0"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label>Benefits</Label>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Priority booking"
                  />
                  {benefits.length > 1 && (
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
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <div className="text-sm text-muted-foreground">Make this package available for purchase</div>
            </div>
            <Switch name="isActive" defaultChecked />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Package
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
