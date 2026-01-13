"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Banknote, CreditCard, Smartphone } from "lucide-react"

export function PaymentDialog({ customer, orderSummary, onComplete, loading, children }) {
    const [open, setOpen] = useState(false)
    const [paymentData, setPaymentData] = useState({
        paymentMode: "CASH",
        cashReceived: orderSummary.calculations.finalAmount,
        paymentDetails: {
            transactionId: "",
            cardDetails: {
                last4Digits: "",
                cardType: "",
            },
            upiDetails: {
                vpa: "",
                transactionRef: "",
            },
        },
        notes: "",
    })

    const handleComplete = () => {
        onComplete(paymentData)
        setOpen(false)
    }

    const change =
        paymentData.paymentMode === "CASH"
            ? Math.max(0, paymentData.cashReceived - orderSummary.calculations.finalAmount)
            : 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-scroll no-scrollbar">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Payment</DialogTitle>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Amount</div>
                            <div className="text-xl font-bold text-red-600">₹{orderSummary.calculations.finalAmount.toFixed(2)}</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-1">
                        <div className="font-medium">Customer: {customer?.name}</div>
                        <div className="text-sm text-gray-500">{customer?.phone}</div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3">
                        <div className="font-medium">Order Summary</div>
                        {orderSummary.services.map((service, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{service.serviceName}</span>
                                <span>₹{(service.price * service.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        {orderSummary.products.map((product, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{product.productName}</span>
                                <span>₹{(product.price * product.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Discount */}
                    {orderSummary.calculations.discount.amount > 0 && (
                        <div className="space-y-2">
                            <div className="font-medium">Discount</div>
                            <div className="flex items-center justify-between">
                                <Select value="Percentage" disabled>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                </Select>
                                <div className="text-green-600 font-medium">-{orderSummary.calculations.discount.percentage}%</div>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <div className="font-medium">Payment Method</div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: "CASH", label: "Cash", icon: Banknote },
                                { value: "UPI", label: "UPI", icon: Smartphone },
                                { value: "CARD", label: "Card", icon: CreditCard },
                            ].map(({ value, label, icon: Icon }) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={paymentData.paymentMode === value ? "default" : "outline"}
                                    className="flex flex-col items-center p-4 h-auto"
                                    onClick={() => setPaymentData((prev) => ({ ...prev, paymentMode: value }))}
                                >
                                    <Icon className="w-6 h-6 mb-1" />
                                    <span className="text-sm">{label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Cash Payment Details */}
                    {paymentData.paymentMode === "CASH" && (
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Cash Received</Label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={paymentData.cashReceived || orderSummary.calculations.finalAmount}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            cashReceived: Number.parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                />
                            </div>
                            {change > 0 && (
                                <div className="p-3 rounded-lg text-sm bg-green-50">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-green-600">Change:</span>
                                        <span className="text-green-600 font-bold">₹{change.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Card Payment Details */}
                    {paymentData.paymentMode === "CARD" && (
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Transaction ID</Label>
                                <Input
                                    className="mt-1"
                                    value={paymentData.paymentDetails.transactionId}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            paymentDetails: { ...prev.paymentDetails, transactionId: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Last 4 Digits</Label>
                                <Input
                                    maxLength="4"
                                    className="mt-1"
                                    value={paymentData.paymentDetails.cardDetails.last4Digits}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            paymentDetails: {
                                                ...prev.paymentDetails,
                                                cardDetails: { ...prev.paymentDetails.cardDetails, last4Digits: e.target.value },
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {/* UPI Payment Details */}
                    {paymentData.paymentMode === "UPI" && (
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Transaction ID</Label>
                                <Input
                                    className="mt-1"
                                    value={paymentData.paymentDetails.transactionId}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            paymentDetails: { ...prev.paymentDetails, transactionId: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium">UPI ID</Label>
                                <Input
                                    className="mt-1"
                                    value={paymentData.paymentDetails.upiDetails.vpa}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            paymentDetails: {
                                                ...prev.paymentDetails,
                                                upiDetails: { ...prev.paymentDetails.upiDetails, vpa: e.target.value },
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Bill Summary */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{orderSummary.calculations.subtotal.toFixed(2)}</span>
                        </div>
                        {orderSummary.calculations.discount.amount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-₹{orderSummary.calculations.discount.amount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total</span>
                            <span className="text-red-600">₹{orderSummary.calculations.finalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between space-x-3">
                        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleComplete} disabled={loading} className="flex-1">
                            {loading ? "Processing..." : "Complete Payment"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
