"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MoreHorizontal, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function FranchiseTable({ franchises }) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  if (franchises.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No franchises found.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredFranchises = franchises.filter((franchise) =>
    franchise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleView = (franchiseId) => {
    router.push(`/admin/branches/${franchiseId}`)
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search franchises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFranchises.map((franchise) => (
              <TableRow
                key={franchise._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleView(franchise._id)}>
                <TableCell className="font-medium">{franchise.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{franchise.code}</Badge>
                </TableCell>
                <TableCell>
                  {franchise.address?.city}, {franchise.address?.state}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{franchise.contact?.phone}</div>
                    <div className="text-muted-foreground">{franchise.contact?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      franchise.subscription?.plan === "ENTERPRISE"
                        ? "default"
                        : franchise.subscription?.plan === "PREMIUM"
                          ? "secondary"
                          : "outline"
                    }>
                    {franchise.subscription?.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={franchise.isActive ? "default" : "destructive"}>
                    {franchise.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">₹{(franchise.analytics?.totalSales || 0).toLocaleString()}</div>
                    <div className="text-muted-foreground">{franchise.analytics?.totalCustomers || 0} customers</div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleView(franchise._id)
                        }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
