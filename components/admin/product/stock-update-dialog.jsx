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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StockUpdateDialog({ children, product }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const OPTIONS = [
    {
      value: 'increase',
      lable: "INCREASE"
    },
    {
      value: 'decrease',
      lable: "DECREASE"
    },
  ]

  const handleSubmit = async (formData) => {
    setLoading(true)

    const payload = {
      quantity: Number.parseInt(formData.get("addStock")),
      operation: formData.get("operation"),
      reason: formData.get("reason") || "Stock update via admin panel"
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
            <Label htmlFor="currentStock">Current Stock </Label>
            <Input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              disabled={true}
              defaultValue={product.stock.current}
              required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentStock">Add Stock *</Label>
            <Input
              id="addStock"
              name="addStock"
              type="number"
              min="0"
              defaultValue={0}
              required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">Operation *</Label>
            <Select name="operation" required>
              <SelectTrigger>
                <SelectValue placeholder="Select Operation" />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.lable}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              name="reason"
              type="text"
              placeholder="Reason for stock update"
              required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumStock">Minimum Stock</Label>
            <Input
              id="minimumStock"
              name="minimumStock"
              type="number"
              disabled={true}
              min="0"
              defaultValue={product.stock.minimum} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maximumStock">Maximum Stock</Label>
            <Input
              id="maximumStock"
              disabled={true}
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
