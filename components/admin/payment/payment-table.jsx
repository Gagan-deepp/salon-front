"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { TableSkeleton } from "@/components/admin/table-skeleton"

export function PaymentTable({ payments, loading, currentPage, totalPages, onPageChange, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", label: "Pending" },
      COMPLETED: { variant: "default", label: "Completed" },
      FAILED: { variant: "destructive", label: "Failed" },
      REFUNDED: { variant: "outline", label: "Refunded" },
    }
    
    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  const getPaymentModeBadge = (mode) => {
    const modeConfig = {
      CASH: { variant: "outline", label: "Cash" },
      CARD: { variant: "secondary", label: "Card" },
      UPI: { variant: "default", label: "UPI" },
    }
    
    const config = modeConfig[mode] || { variant: "outline", label: mode }
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {payments.length} payments
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                <TableRow key={payment._id}>
                  <TableCell className="font-mono text-sm">
                    {payment.paymentId || payment._id?.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.customer?.name}</div>
                      <div className="text-sm text-gray-500">{payment.customer?.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{payment.amounts?.finalAmount?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    {getPaymentModeBadge(payment.paymentMode)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(payment.createdAt)}
                  </TableCell>
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
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
