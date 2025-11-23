"use client";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, Calculator, Receipt, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { createPayment, validatePromoCode, calculatePaymentAmount } from "@/lib/actions/payment_action"
import { getCustomersDropdown } from "@/lib/actions/customer_action"
import { getServices } from "@/lib/actions/service_action"
import { getProducts } from "@/lib/actions/product_action"
import { toast } from "sonner";

export function CreatePaymentDialog({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState("items")
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    servicesTotal: 0,
    productsTotal: 0,
    discount: {
      percentage: 0,
      amount: 0,
      promoCode: ""
    },
    gst: {
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    },
    finalAmount: 0
  })

  const [formData, setFormData] = useState({
    customerId: "",
    services: [],
    products: [],
    paymentMode: "",
    discount: {
      percentage: 0,
      promoCode: "",
    },
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

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, servicesRes, productsRes] = await Promise.all([
          getCustomersDropdown({ limit: 100 }),
          getServices({ limit: 100 }),
          getProducts({ limit: 100 }),
        ])

        if (customersRes.success) setCustomers(customersRes.data.customers || [])
        if (servicesRes.success) setServices(servicesRes.data.services || [])
        if (productsRes.success) setProducts(productsRes.data.products || [])
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  // Calculate amounts when services/products/discount change
  useEffect(() => {
    if (formData.services.length > 0 || formData.products.length > 0) {
      calculateAmounts()
    } else {
      setCalculations({
        subtotal: 0,
        servicesTotal: 0,
        productsTotal: 0,
        discount: { percentage: 0, amount: 0, promoCode: "" },
        gst: { cgst: 0, sgst: 0, igst: 0, total: 0 },
        finalAmount: 0
      })
    }
  }, [formData.services, formData.products, formData.discount.percentage])

  const calculateAmounts = async () => {
    try {
      const payload = {
        services: formData.services,
        products: formData.products,
        discount: formData.discount,
      }

      const result = await calculatePaymentAmount(payload)
      if (result.success) {
        setCalculations(result.data)
      } else {
        // Fallback to local calculation if API fails
        calculateAmountsLocally()
      }
    } catch (error) {
      console.error("Failed to calculate amounts:", error)
      // Fallback to local calculation
      calculateAmountsLocally()
    }
  }

  const calculateAmountsLocally = () => {
    // Calculate services total
    const servicesTotal = formData.services.reduce((total, service) => {
      return total + (service.price * service.quantity)
    }, 0)

    // Calculate products total
    const productsTotal = formData.products.reduce((total, product) => {
      return total + (product.price * product.quantity)
    }, 0)

    // Calculate subtotal
    const subtotal = servicesTotal + productsTotal

    // Calculate discount amount
    const discountAmount = (subtotal * formData.discount.percentage) / 100

    // Calculate amount after discount
    const amountAfterDiscount = subtotal - discountAmount

    // Calculate GST on discounted amount
    let totalGst = 0

    // GST on services after discount
    formData.services.forEach(service => {
      const serviceTotal = service.price * service.quantity
      const serviceAfterDiscount = serviceTotal - (serviceTotal * formData.discount.percentage / 100)
      const gstAmount = (serviceAfterDiscount * service.gstRate) / 100
      totalGst += gstAmount
    })

    // GST on products after discount
    formData.products.forEach(product => {
      const productTotal = product.price * product.quantity
      const productAfterDiscount = productTotal - (productTotal * formData.discount.percentage / 100)
      const gstAmount = (productAfterDiscount * product.gstRate) / 100
      totalGst += gstAmount
    })

    // Split GST (assuming intra-state transaction)
    const cgst = totalGst / 2
    const sgst = totalGst / 2

    // Calculate final amount
    const finalAmount = amountAfterDiscount + totalGst

    setCalculations({
      subtotal,
      servicesTotal,
      productsTotal,
      discount: {
        percentage: formData.discount.percentage,
        amount: discountAmount,
        promoCode: formData.discount.promoCode
      },
      gst: {
        cgst,
        sgst,
        igst: 0,
        total: totalGst
      },
      finalAmount
    })
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, {
        serviceId: "",
        serviceName: "",
        price: 0,
        gstRate: 18,
        providerId: "",
        providerName: "",
        duration: 0,
        quantity: 1,
      }]
    }))
  }

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const updateService = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service)
    }))
  }

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        productId: "",
        productName: "",
        price: 0,
        gstRate: 18,
        quantity: 1,
        unit: "piece",
      }]
    }))
  }

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const updateProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product)
    }))
  }

  const handlePromoCodeValidation = async () => {
    if (!formData.discount.promoCode || calculations.subtotal === 0) return

    try {
      const result = await validatePromoCode({
        promoCode: formData.discount.promoCode,
        amount: calculations.subtotal,
        customerId: formData.customerId,
      })

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          discount: {
            ...prev.discount,
            percentage: result.data.discountPercentage,
          }
        }))
        toast.success(`Promo code applied! Discount: ₹${result.data.discountAmount}`)
      } else {
        toast.warning(result.error)
      }
    } catch (error) {
      toast.error("Failed to validate promo code")
    }
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Ensure calculations.discount includes absolute discount amount, promoCode, offerId etc.
    const payload = {
      ...formData,
      discount: {
        ...formData.discount,
        // The calculation from backend or local
        amount: calculations.discount.amount, // Discount in currency, not just percent
        promoCode: calculations.discount.promoCode || formData.discount.promoCode || "",
        offerId: calculations.discount.offerId || formData.discount.offerId,
        offerName: calculations.discount.offerName || formData.discount.offerName
      },
      amounts: {
        ...calculations,
        discount: {
          ...calculations.discount,
          // Keep all details for full clarity
          promoCode: calculations.discount.promoCode || formData.discount.promoCode || "",
          percentage: calculations.discount.percentage || formData.discount.percentage || 0,
          amount: calculations.discount.amount,
          offerId: calculations.discount.offerId || formData.discount.offerId,
          offerName: calculations.discount.offerName || formData.discount.offerName
        }
      }
    }

    const result = await createPayment(payload)
      if (result.success) {
        toast.success("Payment created successfully")
        onSuccess?.()
        onOpenChange(false)
        // Reset form
        setFormData({
          customerId: "",
          services: [],
          products: [],
          paymentMode: "",
          discount: { percentage: 0, promoCode: "" },
          paymentDetails: {
            transactionId: "",
            cardDetails: { last4Digits: "", cardType: "" },
            upiDetails: { vpa: "", transactionRef: "" },
          },
          notes: "",
        })
        setCalculations({
          subtotal: 0,
          servicesTotal: 0,
          productsTotal: 0,
          discount: { percentage: 0, amount: 0, promoCode: "" },
          gst: { cgst: 0, sgst: 0, igst: 0, total: 0 },
          finalAmount: 0
        })
        setActiveTab("items")
      } else {
        toast.warning(result.error)
      }
    } catch (error) {
      toast.error("Failed to create payment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Quick Create Payment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Column - Form */}
          <div className="flex-1 lg:flex-[2]">
            <ScrollArea className="h-[calc(90vh-120px)] px-6">
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {/* Customer Selection */}
                <div className="space-y-3">
                  <Label htmlFor="customer" className="text-base font-medium">Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-sm text-gray-500">{customer.phone}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Simplified Services */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Services</CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addService}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Select
                            value={service.serviceId}
                            onValueChange={(value) => {
                              const selectedService = services.find(s => s._id === value)
                              if (selectedService) {
                                updateService(index, "serviceId", value)
                                updateService(index, "serviceName", selectedService.name)
                                updateService(index, "price", selectedService.price)
                              }
                            }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((s) => (
                                <SelectItem key={s._id} value={s._id}>
                                  {s.name} - ₹{s.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="1"
                            value={service.quantity}
                            onChange={(e) => updateService(index, "quantity", parseInt(e.target.value) || 1)} />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Simplified Products */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Products</CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.products.map((product, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Select
                            value={product.productId}
                            onValueChange={(value) => {
                              const selectedProduct = products.find(p => p._id === value)
                              if (selectedProduct) {
                                updateProduct(index, "productId", value)
                                updateProduct(index, "productName", selectedProduct.name)
                                updateProduct(index, "price", selectedProduct.price)
                              }
                            }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p._id} value={p._id}>
                                  {p.name} - ₹{p.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProduct(index, "quantity", parseInt(e.target.value) || 1)} />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Payment Mode */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Payment Mode *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "CASH", label: "Cash", icon: Banknote },
                      { value: "CARD", label: "Card", icon: CreditCard },
                      { value: "UPI", label: "UPI", icon: Smartphone },
                    ].map(({ value, label, icon: Icon }) => (
                      <div
                        key={value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMode === value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMode: value }))}>
                        <div className="flex flex-col items-center space-y-1">
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </ScrollArea>
          </div>

          {/* Right Column - Bill Summary */}
          <div className="lg:flex-1 border-l bg-gray-50">
            <div className="sticky top-0 h-[calc(90vh-80px)]">
              <div className="p-4 border-b bg-white">
                <h3 className="text-lg font-semibold flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Bill Summary
                </h3>
              </div>

              <ScrollArea className="h-[calc(90vh-160px)] p-4">
                <div className="space-y-4">
                  {/* Services */}
                  {formData.services.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm text-gray-600">Services:</div>
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm bg-white p-2 rounded">
                          <span>{service.serviceName || `Service ${index + 1}`} x{service.quantity}</span>
                          <span>₹{(service.price * service.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {formData.products.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm text-gray-600">Products:</div>
                      {formData.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm bg-white p-2 rounded">
                          <span>{product.productName || `Product ${index + 1}`} x{product.quantity}</span>
                          <span>₹{(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal:</span>
                      <span>₹{calculations.subtotal.toFixed(2)}</span>
                    </div>
                    {calculations.gst.total > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>GST (18%):</span>
                        <span>₹{calculations.gst.total.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Final Amount:</span>
                      <span>₹{calculations.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Mode Display */}
                  {formData.paymentMode && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800">
                        Payment Mode: {formData.paymentMode}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {calculations.subtotal === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Add items to see summary</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t px-6 py-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {calculations.subtotal > 0 && (
                <span>Total: ₹{calculations.finalAmount.toFixed(2)}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.customerId || !formData.paymentMode || calculations.subtotal === 0}
                className="min-w-[120px]">
                {loading ? "Creating..." : "Create Payment"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
