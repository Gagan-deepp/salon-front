"use client"

import PaginationNumberless from "@/components/customized/pagination/pagination-12"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export function PaymentTable({ payments, pagination, total }) {
  const router = useRouter()
  const searchParams = useSearchParams()


  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", label: "Pending" },
      COMPLETED: { variant: "default", label: "Completed" },
      FAILED: { variant: "destructive", label: "Failed" },
      REFUNDED: { variant: "outline", label: "Refunded" },
    }

    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentModeBadge = (mode) => {
    const modeConfig = {
      CASH: { variant: "outline", label: "Cash" },
      CARD: { variant: "secondary", label: "Card" },
      UPI: { variant: "default", label: "UPI" },
    }

    const config = modeConfig[mode] || { variant: "outline", label: mode }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRowClick = (paymentId) => {
    router.push(`/admin/payments/${paymentId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {payments.length} of {total} payments
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id} className="cursor-pointer" onClick={() => handleRowClick(payment._id)} >
                  <TableCell className="font-mono text-sm">{payment.paymentId || payment._id?.slice(-8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.customerId?.name}</div>
                      <div className="text-sm text-gray-500">{payment.customerId?.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{payment.amounts?.finalAmount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>{getPaymentModeBadge(payment.paymentMode)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-sm">{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/payments/${payment._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationNumberless pagination={pagination} />

    </div>
  )
}
