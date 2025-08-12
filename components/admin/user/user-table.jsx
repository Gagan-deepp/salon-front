"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Crown,
  Store,
  Calculator,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const getRoleIcon = (role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return <Crown className="h-3 w-3" />
    case "FRANCHISE_OWNER":
      return <Store className="h-3 w-3" />
    case "CASHIER":
      return <Calculator className="h-3 w-3" />
    default:
      return null
  }
}

const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "destructive"
    case "FRANCHISE_OWNER":
      return "default"
    case "CASHIER":
      return "secondary"
    default:
      return "outline"
  }
}

export function UserTable({ users, currentPage, totalPages, total, searchParams }) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams?.search || "")
  const roleFilter = searchParams?.role || "all"
  const statusFilter = searchParams?.status || "all"


  const updateSearchParams = (key, value) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to page 1 when filtering
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleSearch = () => {
    updateSearchParams("search", searchTerm)
  }

  const handleRoleFilter = (value) => {
    updateSearchParams("role", value)
  }

  const handleStatusFilter = (value) => {
    updateSearchParams("status", value)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set("page", page.toString())
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const handleRowClick = (userId) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleUserUpdated = () => {
    router.refresh()
  }

  const handleUserDeleted = () => {
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="FRANCHISE_OWNER">Franchise Owner</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Franchise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">No users found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(user._id)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                          {getRoleIcon(user.role)}
                          {user.role?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.franchiseId?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === "CASHIER" ? (
                          <div className="text-sm">
                            <div>₹{user.totalCommissionEarned || 0}</div>
                            <div className="text-muted-foreground">Pending: ₹{user.pendingCommission || 0}</div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <EditUserDialog user={user} onUserUpdated={handleUserUpdated}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </EditUserDialog>
                            <DeleteUserDialog user={user} onUserDeleted={handleUserDeleted}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DeleteUserDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {users.length} of {total} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
