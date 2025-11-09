"use client"

import { useState, useTransition } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteSubscription } from "@/lib/actions/subscription_action"

export function DeleteSubscriptionDialog({
    children,
    subscriptionId,
    subscriptionName,
}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteSubscription(subscriptionId)

                if (result.success) {
                    toast.success("Subscription deleted successfully")
                    router.refresh()
                    setOpen(false)
                } else {
                    toast.warning(result.error || "Failed to delete subscription")
                }
            } catch (error) {
                toast.error("An unexpected error occurred")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <div onClick={() => setOpen(true)}>{children}</div>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the subscription plan "{subscriptionName}". Any active users on this plan may
                        be affected. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete Subscription"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
