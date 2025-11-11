import { CreateSubscriptionDialog } from "@/components/admin/subscription/create-subscription-dialog"
import { SubscriptionsTable } from "@/components/admin/subscription/subscriptions-table"
import { TableSkeleton } from "@/components/admin/table-skeleton"
import { Button } from "@/components/ui/button"
import { getSubscriptions } from "@/lib/actions/subscription_action"
import { Plus } from "lucide-react"
import { Suspense } from "react"


export default async function ProductsPage({ searchParams }) {

    const searchP = await searchParams
    const result = await getSubscriptions({
        page: searchP.page || 1,
        limit: searchP.limit || 10,
        search: searchP.search || "",
        category: searchP.category || "",
        lowStock: searchP.lowStock || "",
    })

    console.log("\n\n Subscriptions result ===> ", result.data)

    const subscriptions = result.data.data || []

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold ">Subscriptions</h1>
                    <p className="text-gray-600">Manage your subscriptions</p>
                </div>

            </div>
            <CreateSubscriptionDialog>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Subscription
                </Button>
            </CreateSubscriptionDialog>


            <Suspense fallback={<TableSkeleton />}>
                <SubscriptionsTable subscriptions={subscriptions} />
            </Suspense>
        </div>
    );
}
