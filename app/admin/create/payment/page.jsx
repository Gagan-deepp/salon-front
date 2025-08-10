"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Calculator, Tag, Receipt, CreditCard, Smartphone, Banknote } from 'lucide-react'
import { createPayment, validatePromoCode, calculatePaymentAmount } from "@/lib/actions/payment_action"
import { getCustomersDropdown } from "@/lib/actions/customer_action"
import { getServices } from "@/lib/actions/service_action"
import { getProducts } from "@/lib/actions/product_action"
import { toast } from "sonner"
import { getUsers } from "@/lib/actions/user"

export default function CreatePaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [providers, setProviders] = useState([])
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
        // cardType,
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
        const [customersRes, servicesRes, productsRes, providerRes] = await Promise.all([
          getCustomersDropdown({ limit: 100 }),
          getServices({ limit: 100 }),
          getProducts({ limit: 100 }),
          getUsers({ page: 1, limit: 100, isActive: true })
        ])


        console.debug("Customer res data ===> ", customers.data)
        console.debug("Service res data ===> ", services.data)
        console.debug("Product res data ===> ", productsRes.data)
        console.debug("providerRes  data ===> ", providerRes.data)
        if (customersRes.success) setCustomers(customersRes.data.data || [])
        if (servicesRes.success) setServices(servicesRes.data.data || [])
        if (productsRes.success) setProducts(productsRes.data.data || [])
        if (providerRes.success) setProviders(providerRes.data.data || [])
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error)
      }
    }

    fetchData()
  }, [])

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
        discountPercentage: formData.discount.percentage,
        promoCode: formData.discount.promoCode,
        discount: formData.discount,
      }

      const result = await calculatePaymentAmount(payload)
      if (result.success) {
        setCalculations(result.data.data)
      } else {
        // Fallback to local calculation if API fails
        // calculateAmountsLocally()
      }
    } catch (error) {
      console.error("Failed to calculate amounts:", error.response)
      // Fallback to local calculation
      // calculateAmountsLocally()
    }
  }
  const servicesTotal = () => {
    return formData.services.reduce((total, service) => {
      return total + (service.price * service.quantity)
    }, 0)
  }

  const productTotal = () => {
    return formData.products.reduce((total, product) => {
      return total + (product.price * product.quantity)
    }, 0)
  }
  // const calculateAmountsLocally = () => {
  //   // Calculate services total
  //   const servicesTotal = formData.services.reduce((total, service) => {
  //     return total + (service.price * service.quantity)
  //   }, 0)

  //   // Calculate products total
  //   const productsTotal = formData.products.reduce((total, product) => {
  //     return total + (product.price * product.quantity)
  //   }, 0)

  //   // Calculate subtotal
  //   const subtotal = servicesTotal + productsTotal

  //   // Calculate discount amount
  //   const discountAmount = (subtotal * formData.discount.percentage) / 100

  //   // Calculate amount after discount
  //   const amountAfterDiscount = subtotal - discountAmount

  //   // Calculate GST on discounted amount
  //   let totalGst = 0

  //   // GST on services after discount
  //   formData.services.forEach(service => {
  //     const serviceTotal = service.price * service.quantity
  //     const serviceAfterDiscount = serviceTotal - (serviceTotal * formData.discount.percentage / 100)
  //     const gstAmount = (serviceAfterDiscount * service.gstRate) / 100
  //     totalGst += gstAmount
  //   })

  //   // GST on products after discount
  //   formData.products.forEach(product => {
  //     const productTotal = product.price * product.quantity
  //     const productAfterDiscount = productTotal - (productTotal * formData.discount.percentage / 100)
  //     const gstAmount = (productAfterDiscount * product.gstRate) / 100
  //     totalGst += gstAmount
  //   })

  //   // Split GST (assuming intra-state transaction)
  //   const cgst = totalGst / 2
  //   const sgst = totalGst / 2

  //   // Calculate final amount
  //   const finalAmount = amountAfterDiscount + totalGst

  //   setCalculations({
  //     subtotal,
  //     servicesTotal,
  //     productsTotal,
  //     discount: {
  //       percentage: formData.discount.percentage,
  //       amount: discountAmount,
  //       promoCode: formData.discount.promoCode
  //     },
  //     gst: {
  //       cgst,
  //       sgst,
  //       igst: 0,
  //       total: totalGst
  //     },
  //     finalAmount
  //   })
  // }

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

        toast.warning(`Promo code applied! Discount: ₹${result.error}`)
      }
    } catch (error) {
      toast.error(`Failed to validate promo code`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        amounts: calculations,
      }

      console.debug("Paylod of payment ==> ", payload)
      const result = await createPayment(payload)
      if (result.success) {
        toast.success(`Payment created successfully`)
        router.push("/admin/payments") // Navigate back to payments list
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
      toast.success(`Failed to create payment`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Payment</h1>
          <p className="text-gray-600">Record a new payment transaction</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Left Column - Form */}
        <Card className="flex-1 lg:flex-[2]  p-6 rounded-lg shadow-sm">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4"> {/* Adjusted height for full page */}
            <form onSubmit={handleSubmit} className="space-y-6 p-2">
              {/* Customer Selection */}
              <div className="space-y-3">
                <Label htmlFor="customer" className="text-base font-medium">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  required>
                  <SelectTrigger className="h-20">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        <div className="flex gap-2">
                          <span className="font-medium">{customer.name}</span>
                          <span className="text-sm text-gray-500">{customer.phone}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabs for better organization */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="discount">Discount</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-6 mt-6">
                  {/* Services Section */}
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Services</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addService}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.services.map((service, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                              <Label className="text-sm font-medium">Service</Label>
                              <Select
                                value={service.serviceId}
                                onValueChange={(value) => {
                                  const selectedService = services.find(s => s._id === value)
                                  if (selectedService) {
                                    updateService(index, "serviceId", value)
                                    updateService(index, "serviceName", selectedService.name)
                                    updateService(index, "price", selectedService.price)
                                    updateService(index, "duration", selectedService.duration)
                                  }
                                }}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {services.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>
                                      <div className="flex flex-col">
                                        <span>{s.name}</span>
                                        <span className="text-sm text-gray-500">₹{s.price}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Price</Label>
                              <Input
                                type="number"
                                className="mt-1"
                                value={service.price}
                                disabled={true}
                                onChange={(e) => updateService(index, "price", parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                className="mt-1"
                                value={service.quantity}
                                onChange={(e) => updateService(index, "quantity", parseInt(e.target.value) || 1)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Provider Name</Label>
                              <Select
                                value={service.providerId}
                                onValueChange={(value) => {
                                  const selectedProvider = providers.find(s => s._id === value)
                                  if (selectedProvider) {
                                    updateService(index, "providerId", value)
                                    updateService(index, "providerName", selectedProvider.name)
                                  }
                                }}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {providers.map((provider) => (
                                    <SelectItem key={provider._id} value={provider._id}>
                                      <div className="flex gap-2">
                                        <span className="font-medium">{provider.name}</span>
                                        <span className="text-sm text-gray-500">{provider.role}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                            </div>
                            <div className="flex items-end justify-between">
                              <div className="flex-1 mr-4">
                                <Label className="text-sm font-medium">Total</Label>
                                <div className="text-lg font-semibold text-green-600 mt-1">
                                  ₹{(service.price * service.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeService(index)}
                                className="text-red-600 hover:text-red-700">
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.services.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <div
                            className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No services added yet</p>
                          <p className="text-sm">Click "Add Service" to get started</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Products Section */}
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Products</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.products.map((product, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                              <Label className="text-sm font-medium">Product</Label>
                              <Select
                                value={product.productId}
                                onValueChange={(value) => {
                                  const selectedProduct = products.find(p => p._id === value)
                                  if (selectedProduct) {
                                    updateProduct(index, "productId", value)
                                    updateProduct(index, "productName", selectedProduct.name)
                                    updateProduct(index, "price", selectedProduct.price.mrp)
                                  }
                                }}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((p) => (
                                    <SelectItem key={p._id} value={p._id}>
                                      <div className="flex flex-col">
                                        <span>{p.name}</span>
                                        <span className="text-sm text-gray-500">₹{p.price.mrp}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Price</Label>
                              <Input
                                type="number"
                                className="mt-1"
                                value={product.price}
                                onChange={(e) => updateProduct(index, "price", parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                className="mt-1"
                                value={product.quantity}
                                onChange={(e) => updateProduct(index, "quantity", parseInt(e.target.value) || 1)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Unit</Label>
                              <Input
                                className="mt-1"
                                value={product.unit}
                                onChange={(e) => updateProduct(index, "unit", e.target.value)} />
                            </div>
                            <div className="flex items-end justify-between">
                              <div className="flex-1 mr-4">
                                <Label className="text-sm font-medium">Total</Label>
                                <div className="text-lg font-semibold text-green-600 mt-1">
                                  ₹{(product.price * product.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeProduct(index)}
                                className="text-red-600 hover:text-red-700">
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <div
                            className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No products added yet</p>
                          <p className="text-sm">Click "Add Product" to get started</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discount" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Discount & Promo Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Promo Code</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter promo code"
                              value={formData.discount.promoCode}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                discount: { ...prev.discount, promoCode: e.target.value }
                              }))} />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePromoCodeValidation}
                              disabled={!formData.discount.promoCode || calculations.subtotal === 0}>
                              <Tag className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Discount %</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount.percentage}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              discount: { ...prev.discount, percentage: parseFloat(e.target.value) || 0 }
                            }))} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6 mt-6">
                  {/* Payment Mode */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Payment Mode *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "CASH", label: "Cash", icon: Banknote },
                        { value: "CARD", label: "Card", icon: CreditCard },
                        { value: "UPI", label: "UPI", icon: Smartphone },
                      ].map(({ value, label, icon: Icon }) => (
                        <div
                          key={value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMode === value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMode: value }))}>
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6" />
                            <span className="font-medium">{label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details */}
                  {formData.paymentMode === "CARD" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Card Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Transaction ID</Label>
                            <Input
                              className="mt-1"
                              value={formData.paymentDetails.transactionId}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                paymentDetails: { ...prev.paymentDetails, transactionId: e.target.value }
                              }))} />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Last 4 Digits</Label>
                            <Input
                              maxLength="4"
                              className="mt-1"
                              value={formData.paymentDetails.cardDetails.last4Digits}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                paymentDetails: {
                                  ...prev.paymentDetails,
                                  cardDetails: { ...prev.paymentDetails.cardDetails, last4Digits: e.target.value }
                                }
                              }))} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Card Type</Label>
                          <Select
                            value={formData?.paymentDetails?.cardDetails?.cardType}
                            onValueChange={(value) => setFormData(prev => ({
                              ...prev,
                              paymentDetails: {
                                ...prev.paymentDetails,
                                cardDetails: { ...prev.paymentDetails.cardDetails, cardType: value }
                              }
                            }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VISA">Visa</SelectItem>
                              <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                              <SelectItem value="RUPAY">RuPay</SelectItem>
                              <SelectItem value="AMEX">American Express</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {formData.paymentMode === "UPI" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">UPI Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Transaction ID</Label>
                            <Input
                              className="mt-1"
                              value={formData.paymentDetails.transactionId}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                paymentDetails: { ...prev.paymentDetails, transactionId: e.target.value }
                              }))} />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">UPI ID</Label>
                            <Input
                              className="mt-1"
                              value={formData.paymentDetails.upiDetails.vpa}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                paymentDetails: {
                                  ...prev.paymentDetails,
                                  upiDetails: { ...prev.paymentDetails.upiDetails, vpa: e.target.value }
                                }
                              }))} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Transaction Reference</Label>
                          <Input
                            className="mt-1"
                            value={formData.paymentDetails.upiDetails.transactionRef}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              paymentDetails: {
                                ...prev.paymentDetails,
                                upiDetails: { ...prev.paymentDetails.upiDetails, transactionRef: e.target.value }
                              }
                            }))} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Notes</Label>
                    <Textarea
                      placeholder="Additional notes..."
                      className="min-h-[100px]"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </ScrollArea>
        </Card>

        {/* Right Column - Bill Summary */}
        <Card className="lg:flex-1  p-6 rounded-lg shadow-sm">
          <div className="sticky top-6"> {/* Adjusted top for sticky behavior */}
            <div className="p-4 border-b  -mx-6 -mt-6 rounded-t-lg"> {/* Adjusted margins for full width */}
              <h3 className="text-lg font-semibold flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Bill Summary
              </h3>
            </div>

            <ScrollArea className="h-[calc(100vh-350px)] p-4"> {/* Adjusted height for full page */}
              <div className="space-y-6">
                {/* Services Breakdown */}
                {formData.services.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-semibold">Services:</div>
                    {formData.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm  p-4 rounded-lg bg-muted">
                        <div className="flex-1">
                          <div className="font-medium">
                            {service.serviceName || `Service ${index + 1}`}
                          </div>
                          <div className="text-gray-500">
                            ₹{service.price} × {service.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(service.price * service.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium border-t pt-3">
                      <span>Services Total:</span>
                      <span>₹{servicesTotal() || 0}</span>
                    </div>
                  </div>
                )}

                {/* Products Breakdown */}
                {formData.products.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-semibold">Products:</div>
                    {formData.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm  p-4 rounded-lg bg-muted">
                        <div className="flex-1">
                          <div className="font-medium">
                            {product.productName || `Product ${index + 1}`}
                          </div>
                          <div className="text-gray-500">
                            ₹{product.price} × {product.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium border-t pt-3">
                      <span>Products Total:</span>
                      <span>₹{productTotal()}</span>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>₹{calculations?.subtotal?.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {calculations.discount.amount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <span>Discount ({calculations.discount.percentage}%)</span>
                      {calculations.discount.promoCode && (
                        <Badge variant="secondary" className="text-xs">
                          {calculations?.discount?.promoCode}
                        </Badge>
                      )}
                    </div>
                    <span>-₹{calculations.discount.amount.toFixed(2)}</span>
                  </div>
                )}

                {/* Amount after discount */}
                {calculations.discount.amount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Amount after discount:</span>
                    <span>₹{(calculations.subtotal - calculations.discount.amount).toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                {/* GST Breakdown */}
                {calculations.gst.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CGST (9%):</span>
                      <span>₹{calculations.gst.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SGST (9%):</span>
                      <span>₹{calculations.gst.sgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total GST:</span>
                      <span>₹{calculations.gst.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Final Amount */}
                <div className="flex justify-between text-xl font-bold">
                  <span>Final Amount:</span>
                  <span className="text-green-600">₹{calculations.finalAmount.toFixed(2)}</span>
                </div>

                {/* Payment Mode Display */}
                {formData.paymentMode && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800">
                      Payment Mode: {formData.paymentMode}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {calculations.subtotal === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No items added</p>
                    <p className="text-sm">Add services or products to see the bill summary</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
      {/* Footer with action buttons */}
      <div className="mt-6 border-t pt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.customerId || !formData.paymentMode || calculations.subtotal === 0}
          className="min-w-[120px]">
          {loading ? "Creating..." : "Create Payment"}
        </Button>
      </div>
    </div>
  );
}
