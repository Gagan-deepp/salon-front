"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { deleteProduct } from "@/lib/actions/product_action"
import { toast } from "sonner"

export function DeleteProductDialog({ children, product }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    const result = await deleteProduct(product._id)

    if (result.success) {
      toast.success("Product deleted successfully")
      setOpen(false)
      router.push("/admin/products")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete product")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Delete Product</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{product.name}</strong>? This action will deactivate the product and
            remove it from active inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
            <div className="ml-2">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                This will deactivate the product with SKU <code className="bg-red-100 px-1 rounded">{product.sku}</code>{" "}
                and remove it from active inventory.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
