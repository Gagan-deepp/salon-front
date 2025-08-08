"use client";
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCustomerHistory } from "@/lib/actions/customer_action"
import { ChevronLeft, ChevronRight, Calendar, Scissors, Package } from 'lucide-react';

export function CustomerHistoryTable({ customerId, history: initialHistory, loading: initialLoading }) {
  const [history, setHistory] = useState(initialHistory || [])
  const [loading, setLoading] = useState(initialLoading || false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadHistory = async (page = 1) => {
    setLoading(true)
    try {
      const result = await getCustomerHistory(customerId, { page, limit: 10 })
      if (result.success) {
        setHistory(result.data.history || result.data || [])
        setTotalPages(result.data.totalPages || 1)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error loading customer history:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialHistory || initialHistory.length === 0) {
      loadHistory(1)
    }
  }, [customerId])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  // Dummy data for preview
  const dummyHistory = [
    {
      _id: "1",
      date: "2024-01-10T14:30:00Z",
      type: "SERVICE",
      services: [
        { name: "Hair Cut & Style", price: 500 },
        { name: "Deep Cleansing Facial", price: 1200 },
      ],
      products: [
        { name: "Hair Serum", price: 999, quantity: 1 },
      ],
      totalAmount: 2699,
      paymentMethod: "UPI",
      status: "COMPLETED",
      loyaltyPointsEarned: 27,
    },
    {
      _id: "2",
      date: "2023-12-15T16:45:00Z",
      type: "SERVICE",
      services: [
        { name: "Bridal Makeup", price: 3500 },
      ],
      products: [],
      totalAmount: 3500,
      paymentMethod: "CARD",
      status: "COMPLETED",
      loyaltyPointsEarned: 35,
    },
    {
      _id: "3",
      date: "2023-11-20T11:30:00Z",
      type: "PRODUCT",
      services: [],
      products: [
        { name: "Face Cream", price: 650, quantity: 2 },
        { name: "Lipstick", price: 399, quantity: 1 },
      ],
      totalAmount: 1699,
      paymentMethod: "CASH",
      status: "COMPLETED",
      loyaltyPointsEarned: 17,
    },
  ]

  const displayHistory = history.length > 0 ? history : dummyHistory

  if (loading && history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayHistory.map((transaction) => (
            <div key={transaction._id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(transaction.date)}</span>
                  <Badge variant="outline">{transaction.paymentMethod}</Badge>
                  <Badge variant={transaction.status === "COMPLETED" ? "default" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(transaction.totalAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    +{transaction.loyaltyPointsEarned} points
                  </div>
                </div>
              </div>

              {transaction.services && transaction.services.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Scissors className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">SERVICES</span>
                  </div>
                  <div className="space-y-1">
                    {transaction.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span>{formatCurrency(service.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {transaction.products && transaction.products.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">PRODUCTS</span>
                  </div>
                  <div className="space-y-1">
                    {transaction.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {product.name} {product.quantity > 1 && `x${product.quantity}`}
                        </span>
                        <span>{formatCurrency(product.price * (product.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {displayHistory.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transaction history available</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistory(currentPage - 1)}
                disabled={currentPage <= 1 || loading}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistory(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
