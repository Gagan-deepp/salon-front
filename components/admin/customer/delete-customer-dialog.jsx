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
import { AlertTriangle } from 'lucide-react'
import { deleteCustomer } from "@/lib/actions/customer_action"
import { toast } from "sonner"

export function DeleteCustomerDialog({ children, customer }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    const result = await deleteCustomer(customer._id)

    if (result.success) {
      toast.success("Customer deleted successfully")
      setOpen(false)
      router.push("/admin/customers")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete customer")
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
            <span>Delete Customer</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone and will
            remove all customer data and history.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
            <div className="ml-2">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete the customer profile, transaction history, and loyalty points for{" "}
                <strong>{customer.phone}</strong>.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
