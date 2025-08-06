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
import { updateProduct } from "@/lib/actions/product_action"
import { toast } from "sonner"

const CATEGORIES = [
  { value: "HAIR_CARE", label: "Hair Care" },
  { value: "SKIN_CARE", label: "Skin Care" },
  { value: "MAKEUP", label: "Makeup" },
  { value: "TOOLS", label: "Tools" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "OTHER", label: "Other" },
]

export function EditProductDialog({ children, product }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      brand: formData.get("brand"),
      description: formData.get("description"),
      price: {
        mrp: Number.parseFloat(formData.get("mrp")),
        selling: Number.parseFloat(formData.get("selling")),
        cost: Number.parseFloat(formData.get("cost")),
      },
      gstRate: Number.parseFloat(formData.get("gstRate")),
      isActive: formData.get("isActive") === "on",
      commissionRate: Number.parseFloat(formData.get("commissionRate")),
    }

    const result = await updateProduct(product._id, payload)

    if (result.success) {
      toast.success("Product updated successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to update product")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product information and settings.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={product.category}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" defaultValue={product.brand} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product.sku} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product.description} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mrp">MRP *</Label>
              <Input
                id="mrp"
                name="mrp"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price.mrp}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling">Selling Price *</Label>
              <Input
                id="selling"
                name="selling"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price.selling}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price.cost} />
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
                defaultValue={product.gstRate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min="0"
                max="30"
                defaultValue={product.commissionRate} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={product.isActive} />
            <Label htmlFor="isActive">Active Status</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
