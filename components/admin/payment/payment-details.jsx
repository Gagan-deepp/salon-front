"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Receipt, MapPin } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "FAILED":
      return "bg-red-100 text-red-800"
    case "REFUNDED":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPaymentModeColor = (mode) => {
  switch (mode) {
    case "CASH":
      return "bg-blue-100 text-blue-800"
    case "CARD":
      return "bg-purple-100 text-purple-800"
    case "UPI":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function PaymentDetails({ payment }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Payment Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment ID</label>
                <p className="text-lg font-semibold">{payment.paymentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                <div className="mt-1">
                  <Badge className={getPaymentModeColor(payment.paymentMode)}>
                    {payment.paymentMode}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date & Time</label>
                <p className="text-sm">
                  {new Date(payment.paymentTimestamp).toLocaleString()}
                </p>
              </div>
            </div>
            {payment.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-sm mt-1">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="font-medium">{payment.customerId?.name || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p>{payment.customerId?.phone || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p>{payment.customerId?.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p>{payment.customerId?.gender || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        {payment.services && payment.services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Service</label>
                        <p className="font-medium">{service.serviceName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Provider</label>
                        <p>{service.providerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Price</label>
                        <p>₹{service.price}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                        <p>{service.quantity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Duration</label>
                        <p>{service.duration} minutes</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">GST Rate</label>
                        <p>{service.gstRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        {payment.products && payment.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.products.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Product</label>
                        <p className="font-medium">{product.productName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Price</label>
                        <p>₹{product.price}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                        <p>{product.quantity} {product.unit}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">GST Rate</label>
                        <p>{product.gstRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Details */}
        {payment.paymentMode !== "CASH" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="font-mono">{payment.paymentDetails?.transactionId || "N/A"}</p>
                </div>
                
                {payment.paymentMode === "CARD" && payment.paymentDetails?.cardDetails && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Card Type</label>
                      <p>{payment.paymentDetails.cardDetails.cardType || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last 4 Digits</label>
                      <p className="font-mono">****{payment.paymentDetails.cardDetails.last4Digits || "****"}</p>
                    </div>
                  </div>
                )}

                {payment.paymentMode === "UPI" && payment.paymentDetails?.upiDetails && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">UPI ID</label>
                      <p>{payment.paymentDetails.upiDetails.vpa || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transaction Reference</label>
                      <p className="font-mono">{payment.paymentDetails.upiDetails.transactionRef || "N/A"}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Processed At</label>
                  <p className="text-sm">
                    {payment.paymentDetails?.processedAt 
                      ? new Date(payment.paymentDetails.processedAt).toLocaleString()
                      : "N/A"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Amount Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Amount Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{payment.amounts?.subtotal?.toFixed(2) || 0}</span>
            </div>
            
            {payment.amounts?.discount?.amount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Discount ({payment.amounts.discount.percentage}%):</span>
                  <span>-₹{payment.amounts.discount.amount.toFixed(2)}</span>
                </div>
                {payment.amounts.discount.promoCode && (
                  <div className="text-sm text-gray-500">
                    Promo: {payment.amounts.discount.promoCode}
                  </div>
                )}
              </>
            )}

            <Separator />
            
            <div className="flex justify-between">
              <span>CGST:</span>
              <span>₹{payment.amounts?.gst?.cgst?.toFixed(2) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST:</span>
              <span>₹{payment.amounts?.gst?.sgst?.toFixed(2) || 0}</span>
            </div>
            {payment.amounts?.gst?.igst > 0 && (
              <div className="flex justify-between">
                <span>IGST:</span>
                <span>₹{payment.amounts.gst.igst.toFixed(2)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Final Amount:</span>
              <span>₹{payment.amounts?.finalAmount?.toFixed(2) || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cashier Info */}
        {payment.cashierInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Cashier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p>{payment.cashierInfo.cashierName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                <p className="font-mono">{payment.cashierInfo.employeeId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Franchise Info */}
        {payment.franchiseId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Franchise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-500">Franchise</label>
                <p>{payment.franchiseId?.name || "N/A"}</p>
              </div>
              {payment.franchiseId?.address && (
                <div className="mt-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">{payment.franchiseId.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
