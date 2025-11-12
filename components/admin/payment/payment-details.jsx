"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, CreditCard, Receipt, MapPin, FileText } from "lucide-react"
import { InvoiceDownloadButton } from "@/components/invoice"

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
  const router = useRouter()

  console.log("Payment Details:", payment)
  const customerInfo = {
    name: payment.customerId?.name || "N/A",
    phoneNumber: payment.customerId?.phone || "N/A",
    modeOfPayment: payment.paymentMode || "N/A",
    placeOfSupply: payment.placeOfSupply || "Place of supply not available",
    placeOfDelivery: payment.placeOfDelivery || "Place of delivery not available",
  }

  const sellerInfo = {
    companyName: payment.franchiseId?.name || "Seller Company Name",
    address: `${payment.franchiseId?.address.street} - ${payment.franchiseId?.address.city} - ${payment.franchiseId?.address.state} - ${payment.franchiseId?.address.country} - ${payment.franchiseId?.address.pincode}` || "Seller Address",
    city: payment.franchiseId?.address.city || "Seller City",
    phone: payment.franchiseId?.phone || "Seller Phone",
    additionalAddress: payment.franchiseId?.additionalAddress || "Seller Additional Address",
  }

  const orderDetails = {
    orderNumber: payment._id || "N/A",
    orderDate: new Date(payment.createdAt).toLocaleDateString("en-IN") || "N/A",
    invoiceNumber: payment.invoiceId || "N/A",
    invoiceDate: new Date(payment.createdAt).toLocaleDateString("en-IN") || "N/A",
    gstNumber: payment.gstNumber || "N/A - GST Number not available",
    panNumber: payment.panNumber || "N/A - PAN Number not available",
    cinNumber: payment.cinNumber || "N/A - CIN Number not available",
  }

  const items = [...payment?.products, ...payment?.services]
  const discount = payment.amounts?.discount || { percentage: 0, amount: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4 flex-col gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-bold">Payment Details</h1>
            <p className="text-muted-foreground">Payment ID: {payment.paymentId || payment._id}</p>
          </div>

          <div>
            <InvoiceDownloadButton
              customerInfo={customerInfo}
              sellerInfo={sellerInfo}
              orderDetails={orderDetails}
              items={items}
              companyLogo={""}
              discount={discount}
              notes={payment?.notes || ""}
            />
          </div>
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
                  <label className="text-sm font-medium ">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Payment Mode</label>
                  <div className="mt-1">
                    <Badge>{payment.paymentMode}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Amount</label>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    ₹{payment.amounts?.finalAmount?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Date</label>
                  <div className="mt-1">
                    {new Date(payment.paymentTimestamp || payment.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  <label className="text-sm font-medium ">Name</label>
                  <div className="font-medium">{payment.customerId?.name || payment.customer?.name || "N/A"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Phone</label>
                  <div>{payment.customerId?.phone || payment.customer?.phone || "N/A"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Email</label>
                  <div>{payment.customerId?.email || payment.customer?.email || "N/A"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium ">Gender</label>
                  <div>{payment.customerId?.gender || payment.customer?.gender || "N/A"}</div>
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
                  <h4 className="font-medium text-muted-foreground mb-3">Services</h4>
                  <div className="space-y-2">
                    {payment.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{service.serviceName}</div>
                          <div className="text-sm ">
                            ₹{service.price} × {service.quantity}
                            {service.providerName && ` • Provider: ${service.providerName}`}
                            {service.duration && ` • ${service.duration} min`}
                          </div>
                        </div>
                        <div className="font-semibold">₹{(service.price * service.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {payment.products && payment.products.length > 0 && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-3">Products</h4>
                  <div className="space-y-2">
                    {payment.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted  rounded-lg">
                        <div>
                          <div className="font-medium">{product.productName}</div>
                          <div className="text-sm ">
                            ₹{product.price} × {product.quantity} {product.unit}
                          </div>
                        </div>
                        <div className="font-semibold">₹{(product.price * product.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                <div className="space-y-3">
                  {payment.paymentDetails?.transactionId && (
                    <div>
                      <label className="text-sm font-medium ">Transaction ID</label>
                      <div className="font-mono">{payment.paymentDetails.transactionId}</div>
                    </div>
                  )}

                  {payment.paymentMode === "CARD" && payment.paymentDetails?.cardDetails && (
                    <>
                      {payment.paymentDetails.cardDetails.last4Digits && (
                        <div>
                          <label className="text-sm font-medium ">Card</label>
                          <div>**** **** **** {payment.paymentDetails.cardDetails.last4Digits}</div>
                        </div>
                      )}
                      {payment.paymentDetails.cardDetails.cardType && (
                        <div>
                          <label className="text-sm font-medium ">Card Type</label>
                          <div>{payment.paymentDetails.cardDetails.cardType}</div>
                        </div>
                      )}
                    </>
                  )}

                  {payment.paymentMode === "UPI" && payment.paymentDetails?.upiDetails && (
                    <>
                      {payment.paymentDetails.upiDetails.vpa && (
                        <div>
                          <label className="text-sm font-medium ">UPI ID</label>
                          <div>{payment.paymentDetails.upiDetails.vpa}</div>
                        </div>
                      )}
                      {payment.paymentDetails.upiDetails.transactionRef && (
                        <div>
                          <label className="text-sm font-medium ">Transaction Reference</label>
                          <div className="font-mono">{payment.paymentDetails.upiDetails.transactionRef}</div>
                        </div>
                      )}
                    </>
                  )}

                  {payment.paymentDetails?.processedAt && (
                    <div>
                      <label className="text-sm font-medium ">Processed At</label>
                      <div className="text-sm">{new Date(payment.paymentDetails.processedAt).toLocaleString()}</div>
                    </div>
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
                <p className="text-muted-foreground">{payment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Bill Summary */}
        <div className="lg:col-span-1">
          <Card >
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{payment.amounts?.subtotal?.toFixed(2) || "0.00"}</span>
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
                  {payment.amounts.gst.igst > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>IGST:</span>
                      <span>₹{payment.amounts.gst.igst.toFixed(2)}</span>
                    </div>
                  )}
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
                <span className="text-green-600">₹{payment.amounts?.finalAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cashier Info */}
          {payment.cashierInfo && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Cashier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium ">Name</label>
                  <p>{payment.cashierInfo.cashierName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium ">Employee ID</label>
                  <p className="font-mono">{payment.cashierInfo.cashierId._id}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Franchise Info */}
          {payment.franchiseId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Franchise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium ">Franchise</label>
                  <p>{payment.franchiseId?.name || "N/A"}</p>
                </div>
                {payment.franchiseId?.address && (
                  <div className="mt-2">
                    <label className="text-sm font-medium ">Address</label>
                    <p className="text-sm">{payment.franchiseId.address.street} - {payment.franchiseId.address.city}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
