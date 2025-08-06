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
import { deleteService } from "@/lib/actions/service_action"
import { toast } from "sonner"

export function DeleteServiceDialog({ children, service }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    const result = await deleteService(service._id)

    if (result.success) {
      toast.success("Service deleted successfully")
      setOpen(false)
      router.push("/admin/services")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete service")
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
            <span>Delete Service</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{service.name}</strong>? This action will deactivate the service and
            remove it from available offerings.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
            <div className="ml-2">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                This will deactivate the service and remove it from booking options. Duration: {service.duration}{" "}
                minutes, Price: ₹{service.price}.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
