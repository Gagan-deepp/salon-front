"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Receipt, User, CreditCard, FileText } from 'lucide-react';
import { getPaymentById } from "@/lib/actions/payment_action"
import { PaymentDetailsSkeleton } from "@/components/admin/payment/payment-details-skeleton"
import { toast } from "sonner"

export default function PaymentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true)
        const result = await getPaymentById(params.id)
        if (result.success) {
          setPayment(result.data)
        } else {
          toast.warning("Failed to fetch payment details")
        }
      } catch (error) {
        console.error("Failed to fetch payment:", error)
        toast.error("Failed to fetch payment details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPayment()
    }
  }, [params.id])

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return <PaymentDetailsSkeleton />;
  }

  if (!payment) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Payment not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <p className="text-gray-600">Payment ID: {payment.paymentId || payment._id}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Payment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                  <div className="mt-1">
                    {getPaymentModeBadge(payment.paymentMode)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    ₹{payment.amounts?.finalAmount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <div className="mt-1">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <div className="font-medium">{payment.customer?.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div>{payment.customer?.phone}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div>{payment.customer?.email || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services & Products */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Services */}
              {payment.services && payment.services.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Services</h4>
                  <div className="space-y-2">
                    {payment.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{service.serviceName}</div>
                          <div className="text-sm text-gray-500">
                            ₹{service.price} × {service.quantity}
                            {service.providerName && ` • Provider: ${service.providerName}`}
                          </div>
                        </div>
                        <div className="font-semibold">
                          ₹{(service.price * service.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {payment.products && payment.products.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Products</h4>
                  <div className="space-y-2">
                    {payment.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{product.productName}</div>
                          <div className="text-sm text-gray-500">
                            ₹{product.price} × {product.quantity} {product.unit}
                          </div>
                        </div>
                        <div className="font-semibold">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          {payment.paymentDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.paymentDetails.transactionId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                      <div className="font-mono">{payment.paymentDetails.transactionId}</div>
                    </div>
                  )}

                  {payment.paymentMode === 'CARD' && payment.paymentDetails.cardDetails && (
                    <>
                      {payment.paymentDetails.cardDetails.last4Digits && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Card</label>
                          <div>**** **** **** {payment.paymentDetails.cardDetails.last4Digits}</div>
                        </div>
                      )}
                      {payment.paymentDetails.cardDetails.cardType && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Card Type</label>
                          <div>{payment.paymentDetails.cardDetails.cardType}</div>
                        </div>
                      )}
                    </>
                  )}

                  {payment.paymentMode === 'UPI' && payment.paymentDetails.upiDetails && (
                    <>
                      {payment.paymentDetails.upiDetails.vpa && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">UPI ID</label>
                          <div>{payment.paymentDetails.upiDetails.vpa}</div>
                        </div>
                      )}
                      {payment.paymentDetails.upiDetails.transactionRef && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Transaction Reference</label>
                          <div className="font-mono">{payment.paymentDetails.upiDetails.transactionRef}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {payment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{payment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Bill Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{payment.amounts?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>

              {/* Discount */}
              {payment.amounts?.discount?.amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount ({payment.amounts.discount.percentage}%)
                    {payment.amounts.discount.promoCode && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {payment.amounts.discount.promoCode}
                      </Badge>
                    )}
                  </span>
                  <span>-₹{payment.amounts.discount.amount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              {/* GST Breakdown */}
              {payment.amounts?.gst?.total > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CGST:</span>
                    <span>₹{payment.amounts.gst.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SGST:</span>
                    <span>₹{payment.amounts.gst.sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total GST:</span>
                    <span>₹{payment.amounts.gst.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Final Amount */}
              <div className="flex justify-between text-lg font-bold">
                <span>Final Amount:</span>
                <span className="text-green-600">₹{payment.amounts?.finalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
