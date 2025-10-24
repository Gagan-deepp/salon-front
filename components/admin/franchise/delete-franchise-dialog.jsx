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
import { toast } from "sonner"

export function DeleteFranchiseDialog({ children, franchise }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      // Simulate API call - replace with actual delete action when available
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Franchise deleted successfully")
      setOpen(false)
      router.push("/admin/franchises")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete franchise")
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
            <span>Delete Franchise</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{franchise?.name || ""}</strong>? This action cannot be undone and will
            remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
            <div className="ml-2">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete the franchise and all its related data including analytics and settings.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Franchise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
