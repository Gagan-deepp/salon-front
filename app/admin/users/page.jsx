import { TableSkeleton } from "@/components/admin/table-skeleton"
import { CreateUserDialog } from "@/components/admin/user/create-user-dialog"
import { UserTable } from "@/components/admin/user/user-table"
import { Button } from "@/components/ui/button"
import { getUsers } from "@/lib/actions/user_action"
import { auth } from "@/lib/auth"
import { Plus } from "lucide-react"
import { Suspense } from "react"

export default async function UsersPage({ searchParams }) {

    const searchP = await searchParams
    const { user } = await auth()

    // Server-side data fetching
    const params = {
        page: Number(searchP?.page) || 1,
        limit: 10,
        search: searchP?.search || "",
        role: searchP?.role !== "all" ? searchP?.role : undefined,
        isActive: searchP?.status || true,
    }

    const result = await getUsers(params)
    const users = result.success ? result.data.data || [] : []
    const total = result.success ? result.data.total || 0 : 0
    const totalPages = Math.ceil(total / 10)

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage system users and their roles</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateUserDialog isSuperAdmin={user.role === "SUPER_ADMIN"}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </CreateUserDialog>
                </div>
            </div>
            <Suspense fallback={<TableSkeleton />}>
                <UserTable users={users} currentPage={params.page} totalPages={totalPages} total={total} searchParams={params} />
            </Suspense>
        </div>
    )
}
