"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Eye, MoreHorizontal, Users, Calendar, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

const SUBSCRIPTION_PLANS = [
  { value: "BASIC", label: "Basic", color: "bg-blue-100 text-blue-800" },
  { value: "STANDARD", label: "Standard", color: "bg-green-100 text-green-800" },
  { value: "PREMIUM", label: "Premium", color: "bg-purple-100 text-purple-800" },
]

const SUBSCRIPTION_STATUS = [
  { value: "TRIAL", label: "Trial", variant: "secondary" },
  { value: "ACTIVE", label: "Active", variant: "default" },
  { value: "INACTIVE", label: "Inactive", variant: "destructive" },
  { value: "EXPIRED", label: "Expired", variant: "destructive" },
]

export function CompanyTable({ companies }) {
  const router = useRouter()

  if (!companies || companies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No companies found</p>
            <p className="text-muted-foreground">Start by adding your first salon company.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

// Update the handleView function
const handleView = (companyId) => {
  console.log("🎯 Navigating to company:", companyId)
  router.push(`/admin/companies/${companyId}`) // Make sure this matches your dynamic route
}


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const getPlanDetails = (plan) => {
    return SUBSCRIPTION_PLANS.find((p) => p.value === plan) || SUBSCRIPTION_PLANS[0];
  }

  const getStatusDetails = (status) => {
    return SUBSCRIPTION_STATUS.find((s) => s.value === status) || SUBSCRIPTION_STATUS[0];
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Monthly Revenue</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => {
              const planDetails = getPlanDetails(company.subscription?.plan)
              const statusDetails = getStatusDetails(company.subscription?.status)
              
              return (
                <TableRow
                  key={company._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleView(company.companyId)}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{company.name}</div>
                      <div className="text-sm text-muted-foreground">{company.companyId}</div>
                      <div className="text-xs text-muted-foreground">{company.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{company.owner?.name}</div>
                      <div className="text-sm text-muted-foreground">{company.owner?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={planDetails.color}>
                        {planDetails.label}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(company.subscription?.monthlyPrice || 0)}/month
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusDetails.variant}>
                      {statusDetails.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Users className="h-3 w-3" />
                        <span>{company.usage?.users || 0}/{company.subscription?.maxUsers || 0} users</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Building2 className="h-3 w-3" />
                        <span>{company.usage?.franchises || 0}/{company.subscription?.maxFranchises || 0} locations</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">
                        {formatCurrency(company.usage?.monthlyRevenue || 0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(company.createdAt)}</span>
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
                            handleView(company.companyId)
                          }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
