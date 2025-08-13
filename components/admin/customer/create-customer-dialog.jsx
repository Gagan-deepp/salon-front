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
import { createCustomer } from "@/lib/actions/customer_action"
import { getFranchises, getMyFranchise } from "@/lib/actions/franchise_action"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
]

async function fetchFranchises({ isAdmin }) {
  const result = isAdmin ? await getFranchises({ limit: 100 }) : await getMyFranchise()
  return result.success ? result.data.data || result.data : []
}

export function CreateCustomerDialog({ children, handleCustomerCreated }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [franchises, setFranchises] = useState([])
  const router = useRouter()

  const { data: session } = useSession()

  useEffect(() => {
    const loadFranchises = async () => {
      const franchiseList = await fetchFranchises({ isAdmin: session?.user?.role === "SUPER_ADMIN" })
      setFranchises(franchiseList)
    }
    if (open) {
      loadFranchises()
    }
  }, [open])

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email") || undefined,
      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth") || undefined,
      address: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      },
      franchiseId: formData.get("franchiseId"),
      preferences: {
        notes: formData.get("notes") || undefined,
      },
    }

    const result = await createCustomer(payload)

    if (result.success) {
      toast.success("Customer created successfully")
      setOpen(false)

      if (handleCustomerCreated) {
        handleCustomerCreated(result.data.data);
      }

      router.refresh()
    } else {
      toast.error(result.error || "Failed to create customer")
    }

    setLoading(false)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>Add a new customer to your database.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="franchiseId">Franchise *</Label>
              <Select name="franchiseId" required disabled={session?.user?.role !== "SUPER_ADMIN"} value={session?.user?.role !== "SUPER_ADMIN" ? session?.franchiseId : ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select franchise" />
                </SelectTrigger>
                <SelectContent>
                  {franchises?.map((franchise) => (
                    <SelectItem key={franchise._id} value={franchise._id}>
                      {franchise.name} ({franchise.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Textarea id="street" name="street" rows={2} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any special preferences or notes..." />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
