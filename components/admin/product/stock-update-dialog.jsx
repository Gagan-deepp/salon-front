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
import { updateProductStock } from "@/lib/actions/product_action"
import { toast } from "sonner"

export function StockUpdateDialog({ children, product }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      current: Number.parseInt(formData.get("currentStock")),
      minimum: Number.parseInt(formData.get("minimumStock")),
      maximum: Number.parseInt(formData.get("maximumStock")),
    }

    const result = await updateProductStock(product._id, payload)

    if (result.success) {
      toast.success("Stock updated successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to update stock")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>Update stock levels for {product.name}</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentStock">Current Stock *</Label>
            <Input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              defaultValue={product.stock.current}
              required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumStock">Minimum Stock</Label>
            <Input
              id="minimumStock"
              name="minimumStock"
              type="number"
              min="0"
              defaultValue={product.stock.minimum} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maximumStock">Maximum Stock</Label>
            <Input
              id="maximumStock"
              name="maximumStock"
              type="number"
              min="0"
              defaultValue={product.stock.maximum} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
