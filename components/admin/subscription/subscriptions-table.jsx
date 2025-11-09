"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { UpdateSubscriptionDialog } from "./update-subscription-dialog"
import { DeleteSubscriptionDialog } from "./delete-subscription-dialog"


export function SubscriptionsTable({ subscriptions }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No subscriptions found. Create your first subscription plan.
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Per Store</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription._id}>
              <TableCell className="font-mono text-xs">{subscription.subscriptionId}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{subscription.displayName}</div>
                  <div className="text-sm text-muted-foreground">{subscription.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{subscription.tier}</Badge>
              </TableCell>
              <TableCell>
                {subscription.pricing.currency} {subscription.pricing.basePrice}
                <span className="text-xs text-muted-foreground">/{subscription.pricing.billingCycle}</span>
              </TableCell>
              <TableCell>
                {subscription.pricing.currency} {subscription.pricing.perStorePrice}
              </TableCell>
              <TableCell className="text-sm">
                <div>{subscription.limits.maxStores} stores</div>
                <div className="text-muted-foreground">{subscription.limits.maxUsers} users</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant={subscription.isActive ? "default" : "secondary"}>
                    {subscription.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {subscription.isVisible && <Badge variant="outline">Visible</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <UpdateSubscriptionDialog subscription={subscription}>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </UpdateSubscriptionDialog>
                  <DeleteSubscriptionDialog
                    subscriptionId={subscription._id}
                    subscriptionName={subscription.displayName}
                  >
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DeleteSubscriptionDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
