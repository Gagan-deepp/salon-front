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
import { createProduct } from "@/lib/actions/product_action"
import { getFranchises } from "@/lib/actions/franchise_action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

const CATEGORIES = [
  { value: "HAIR_CARE", label: "Hair Care" },
  { value: "SKIN_CARE", label: "Skin Care" },
  { value: "MAKEUP", label: "Makeup" },
  { value: "TOOLS", label: "Tools" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "OTHER", label: "Other" },
]

async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export function CreateProductDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [franchises, setFranchises] = useState([])
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

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      type: formData.get("type"),
      brand: formData.get("brand"),
      description: formData.get("description"),
      sku: formData.get("sku"),
      price: {
        mrp: Number.parseFloat(formData.get("mrp")),
        selling: Number.parseFloat(formData.get("selling")),
        cost: Number.parseFloat(formData.get("cost")),
      },
      gstRate: Number.parseFloat(formData.get("gstRate")),
      stock: {
        current: Number.parseInt(formData.get("currentStock")),
        minimum: Number.parseInt(formData.get("minimumStock")),
        maximum: Number.parseInt(formData.get("maximumStock")),
      },
      franchiseId: formData.get("franchiseId"),
      commissionRate: Number.parseFloat(formData.get("commissionRate")),
    }

    const result = await createProduct(payload)

    if (result.success) {
      toast.success("Product created successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to create product")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>Add a new product to your inventory.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" placeholder="Enter product name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required>
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retails"> Retails </SelectItem>
                  <SelectItem value="consumables"> Consumables </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="Enter brand name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" name="sku" placeholder="Enter SKU" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="franchiseId">Franchise *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mrp">MRP *</Label>
              <Input id="mrp" name="mrp" type="number" step="0.01" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling">Selling Price *</Label>
              <Input id="selling" name="selling" type="number" step="0.01" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price</Label>
              <Input id="cost" name="cost" type="number" step="0.01" min="0" />
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
                defaultValue="18" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="30"
                defaultValue="5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                name="currentStock"
                type="number"
                min="0"
                defaultValue="0"
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock</Label>
              <Input
                id="minimumStock"
                name="minimumStock"
                type="number"
                min="0"
                defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maximumStock">Maximum Stock</Label>
              <Input
                id="maximumStock"
                name="maximumStock"
                type="number"
                min="0"
                defaultValue="100" />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer" >
              {loading ? <> Creating... <Loader2 className="animate-spin" /> </> : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
