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
import { createFranchise } from "@/lib/actions/franchise_action"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

// Indian States and Cities data
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

export function CreateFranchiseDialog({ children, companyId }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  // Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([])
        return
      }

      setLoadingCities(true)
      try {
        // Using countriesnow API for Indian cities
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: "India",
            state: selectedState
          })
        })
        
        const data = await response.json()
        if (data.error) {
          console.error("Error fetching cities:", data.msg)
          setCities([])
        } else {
          setCities(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error)
        setCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    fetchCities()
  }, [selectedState])

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      name: formData.get("name"),
      address: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
        country: "India",
      },
      contact: {
        phone: formData.get("phone"),
        email: formData.get("email"),
        whatsapp: formData.get("whatsapp"),
      },
      gstNumber: formData.get("gstNumber"),
      ownerId: session.user.id,
      subscription: {
        plan: formData.get("plan"),
      },
      companyId: companyId,
    }

    const result = await createFranchise(payload)

    if (result.success) {
      toast.success("Franchise created successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to create franchise")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Franchise</DialogTitle>
          <DialogDescription>Add a new franchise location to your network.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Franchise Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select name="plan" defaultValue="BASIC">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
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
              <Label htmlFor="state">State *</Label>
              <Select 
                name="state" 
                required 
                onValueChange={(value) => setSelectedState(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select 
                name="city" 
                required 
                disabled={!selectedState || loadingCities}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCities ? "Loading..." : selectedState ? "Select city" : "Select state first"} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No cities available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input 
                id="pincode" 
                name="pincode" 
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="000000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" type="tel" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" name="gstNumber" />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Franchise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
