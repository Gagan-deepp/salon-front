"use client";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react'
import { CreatePaymentDialog } from "@/components/admin/payment/create-payment-dialog"
import { PaymentTable } from "@/components/admin/payment/payment-table"
import { getFranchisePayments, getPaymentAnalyticsSummary } from "@/lib/actions/payment_action"
import Link from "next/link"
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    averageBill: 0,
    uniqueCustomers: 0
  })
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentModeFilter, setPaymentModeFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        paymentMode: paymentModeFilter,
      }

      const result = await getFranchisePayments(params)
      if (result.success) {
        setPayments(result.data.payments || [])
        setTotalPages(Math.ceil((result.data.total || 0) / 10))
      } else {
        toast.warning("Failed to fetch payments")
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      toast.error("Failed to fetch payments")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const result = await getPaymentAnalyticsSummary({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      })
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [currentPage, searchTerm, statusFilter, paymentModeFilter])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleCreateSuccess = () => {
    fetchPayments()
    fetchAnalytics()
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  const handlePaymentModeFilter = (value) => {
    setPaymentModeFilter(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 px-8 py-4">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage and track all payment transactions</p>
        </div>
      </div>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bill</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.averageBill?.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
      </div>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10" />
            </div>
            <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={paymentModeFilter || "all"}
              onValueChange={handlePaymentModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Payment Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Modes</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setPaymentModeFilter("")
                setCurrentPage(1)
              }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentTable
            payments={payments}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onRefresh={fetchPayments} />
        </CardContent>
      </Card>
      {/* Create Payment Dialog */}
      <CreatePaymentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess} />
    </div>
  );
}
