"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createUser } from "@/lib/actions/user_action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getFranchises } from "@/lib/actions/franchise_action"

async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export function CreateUserDialog({ children, onUserCreated, isSuperAdmin = true }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [franchises, setFranchises] = useState([])
  const router = useRouter()


  useEffect(() => {
    const loadFranchises = async () => {
      const franchiseList = await fetchFranchises()
      setFranchises(franchiseList)
    }
    if (open) {
      loadFranchises()
    }
  }, [open])

  const handleSubmit = async (formData) => {
    setLoading(true)

    const role = formData.get("role")

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      role: role,
      isActive: formData.get("isActive") === "on",
    }

    // Add franchise ID if not super admin
    if (role !== "SUPER_ADMIN") {
      payload.franchiseId = formData.get("franchiseId")
    }

    // Add commission structure for cashier
    if (role === "CASHIER") {
      payload.commissionStructure = {
        type: formData.get("commissionType") || "PERCENTAGE",
        defaultServiceRate: Number(formData.get("serviceRate")) || 10,
        defaultProductRate: Number(formData.get("productRate")) || 5,
      }
    }

    const result = await createUser(payload)

    if (result.success) {
      toast.success("User created successfully")
      setOpen(false)
      router.refresh()
      onUserCreated?.()
    } else {
      toast.error(result.error || "Failed to create user")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}  >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" placeholder="+91 9876543210" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" placeholder="Min 6 characters" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select name="role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>}
                  <SelectItem value="FRANCHISE_OWNER">Franchise Owner</SelectItem>
                  <SelectItem value="CASHIER">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              {/* <Label htmlFor="franchiseId">Franchise ID</Label>
              <Input id="franchiseId" name="franchiseId" placeholder="Leave empty for Super Admin" /> */}
              <Label htmlFor="franchiseId">Franchise *</Label>
              <Select name="franchiseId" required>
                <SelectTrigger>
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
          </div>

          {/* Commission Structure for CASHIER - shown by default, will be ignored if not cashier */}
          <div className="space-y-4 p-4 border rounded-lg ">
            <h3 className="font-medium">Commission Structure (For Cashier Role)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionType">Commission Type</Label>
                <Select name="commissionType" defaultValue="PERCENTAGE">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceRate">Service Rate (%)</Label>
                <Input id="serviceRate" name="serviceRate" type="number" min="0" max="100" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productRate">Product Rate (%)</Label>
                <Input id="productRate" name="productRate" type="number" min="0" max="100" defaultValue="5" />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <div className="text-sm text-muted-foreground">User can access the system when active</div>
            </div>
            <Switch name="isActive" defaultChecked />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
