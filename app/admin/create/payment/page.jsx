"use client"

import { CreateCustomerDialog } from "@/components/admin/customer/create-customer-dialog"
import { DiscountDialog } from "@/components/admin/payment/discount-dialog"
import { PaymentDialog } from "@/components/admin/payment/payment-dialog"
import { ProductCard } from "@/components/admin/payment/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCustomersDropdown } from "@/lib/actions/customer_action"
import { calculatePaymentAmount, createPayment, validatePromoCode } from "@/lib/actions/payment_action"
import { getProducts } from "@/lib/actions/product_action"
import { getServices } from "@/lib/actions/service_action"
import { getUsers } from "@/lib/actions/user_action"
import { Calculator, IndianRupee, Loader2, Plus, Receipt, Tag, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function CreatePaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [customers, setCustomers] = useState([])
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    servicesTotal: 0,
    productsTotal: 0,
    discount: {
      percentage: 0,
      amount: 0,
      promoCode: "",
    },
    gst: {
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
    },
    finalAmount: 0,
  })

  const [formData, setFormData] = useState({
    customerId: "",
    services: [],
    products: [],
    discount: {
      percentage: 0,
      promoCode: "",
    },
  })

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, servicesRes, productsRes, providerRes] = await Promise.all([
          getCustomersDropdown({ limit: 100 }),
          getServices({ limit: 100 }),
          getProducts({ limit: 100 }),
          getUsers({ page: 1, limit: 100, isActive: true }),
        ])

        console.debug("Customer res data ===> ", customersRes.data)
        console.debug("Service res data ===> ", servicesRes.data)
        console.debug("Product res data ===> ", productsRes.data)
        console.debug("providerRes  data ===> ", providerRes.data)

        if (customersRes.success && customersRes.data.data?.length > 0) {
          setCustomers(customersRes.data.data)
        }
        if (servicesRes.success && servicesRes.data.data?.length > 0) {
          setServices(servicesRes.data.data)
        }
        if (productsRes.success && productsRes.data.data?.length > 0) {
          setProducts(productsRes.data.data)
        }
        if (providerRes.success && providerRes.data.data?.length > 0) {
          setProviders(providerRes.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error)
        console.log("Using dummy data for testing")
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
        finalAmount: 0,
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
        calculateAmountsLocally()
      }
    } catch (error) {
      console.error("Failed to calculate amounts:", error.response)
      calculateAmountsLocally()
    }
  }

  const calculateAmountsLocally = () => {
    const servicesSubtotal = servicesTotal()
    const productsSubtotal = productTotal()
    const subtotal = servicesSubtotal + productsSubtotal

    const discountAmount = (subtotal * formData.discount.percentage) / 100
    const amountAfterDiscount = subtotal - discountAmount

    // Calculate GST (18% total - 9% CGST + 9% SGST)
    const gstAmount = (amountAfterDiscount * 18) / 100
    const cgst = gstAmount / 2
    const sgst = gstAmount / 2

    const finalAmount = amountAfterDiscount + gstAmount

    setCalculations({
      subtotal,
      servicesTotal: servicesSubtotal,
      productsTotal: productsSubtotal,
      discount: {
        percentage: formData.discount.percentage,
        amount: discountAmount,
        promoCode: formData.discount.promoCode,
      },
      gst: {
        cgst,
        sgst,
        igst: 0,
        total: gstAmount,
      },
      finalAmount,
    })
  }

  const servicesTotal = () => {
    return formData.services.reduce((total, service) => {
      return total + service.price * service.quantity
    }, 0)
  }

  const handleRemoveService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.serviceId !== serviceId),
    }))
  }

  const productTotal = () => {
    return formData.products.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
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
        setFormData((prev) => ({
          ...prev,
          discount: {
            ...prev.discount,
            percentage: result.data.discountPercentage,
          },
        }))
        toast.success(`Promo code applied! Discount: ₹${result.data.discountAmount}`)
      } else {
        toast.warning(`Promo code applied! Discount: ₹${result.error}`)
      }
    } catch (error) {
      toast.error(`Failed to validate promo code`)
    }
  }

  const handleCustomerCreated = (newCustomer) => {
    setCustomers((prevCustomers) => [newCustomer, ...prevCustomers])
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId: newCustomer._id,
    }))
  }

  const handleDiscountApply = (discountData) => {
    setFormData((prev) => ({
      ...prev,
      discount: discountData,
    }))
  }

  const handlePaymentComplete = async (paymentData) => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        ...paymentData,
        amounts: calculations,
      }

      const result = await createPayment(payload)

      console.log("Create payment result ==> ", result)
      if (result.success) {
        // Get the invoice/payment data from the result (now populated!)
        const invoice = result.data.invoice
        const payment = result.data.payment

        // Get selected customer for fallback
        const selectedCustomer = customers.find((c) => c._id === formData.customerId)

        // Prepare the invoice data - now using populated data from backend
        const invoiceData = {
          customerInfo: {
            name: invoice.customerId?.name || selectedCustomer?.name || "N/A",
            phoneNumber: invoice.customerId?.phone || selectedCustomer?.phone || "N/A",
            email: invoice.customerId?.email || selectedCustomer?.email || "",
            address: invoice.customerId?.address || selectedCustomer?.address || "",
            modeOfPayment: payment.paymentMode || "N/A",
            placeOfSupply: paymentData.placeOfSupply || invoice.customerId?.address?.state || "N/A",
            placeOfDelivery: paymentData.placeOfDelivery || invoice.customerId?.address?.city || "N/A",
          },
          sellerInfo: {
            companyName: invoice.franchiseId?.name || "N/A",
            address: invoice.franchiseId?.address
              ? `${invoice.franchiseId.address.street}, ${invoice.franchiseId.address.city}, ${invoice.franchiseId.address.state}, ${invoice.franchiseId.address.country} - ${invoice.franchiseId.address.pincode}`
              : "N/A",
            city: invoice.franchiseId?.address?.city || "N/A",
            phone: invoice.franchiseId?.contact?.phone || "N/A",
            email: invoice.franchiseId?.contact?.email || "N/A",
            gstNumber: invoice.franchiseId?.gstNumber || "N/A",
            additionalAddress: invoice.franchiseId?.additionalAddress || "",
          },
          orderDetails: {
            orderNumber: payment._id || invoice._id,
            orderDate: new Date(invoice.createdAt).toLocaleDateString("en-IN"),
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: new Date(invoice.createdAt).toLocaleDateString("en-IN"),
            gstNumber: invoice.franchiseId?.gstNumber || "N/A",
            panNumber: invoice.franchiseId?.panNumber || "N/A",
            cinNumber: invoice.franchiseId?.cinNumber || "N/A",
          },
          items: [
            ...formData.services.map(s => ({
              serviceName: s.serviceName,
              price: s.price,
              quantity: s.quantity,
              gstRate: s.gstRate || 18
            })),
            ...formData.products.map(p => ({
              productName: p.productName,
              price: p.price,
              quantity: p.quantity,
              gstRate: p.gstRate || 18
            }))
          ],
          discount: {
            percentage: calculations.discount.percentage,
            amount: calculations.discount.amount
          }
        }

        const response = await fetch('/api/send-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoiceData),
        })

        const res = await response.json()
        console.log("invoice response ==> ", res)
        toast.success(`Payment created successfully`)
        // router.push("/admin/payments")
      } else {
        toast.warning(result.error)
      }
    } catch (error) {
      toast.error(`Failed to create payment`)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Payment</h1>
          <p className="text-gray-600">Record a new payment transaction</p>
        </div>

        {/* Header Dialogs */}
        <div className="flex md:flex-row gap-4 items-center" >
          <CreateCustomerDialog handleCustomerCreated={handleCustomerCreated}>
            <Button type="button">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </CreateCustomerDialog>

          {(calculations.subtotal > 0 || servicesTotal() + productTotal() > 0) && (
            <div className="space-y-4">
              <DiscountDialog
                discount={formData.discount}
                subtotal={calculations.subtotal || servicesTotal() + productTotal()}
                customerId={formData.customerId}
                onApply={handleDiscountApply}
                onValidatePromo={handlePromoCodeValidation}
              >
                <Button type="button" variant="default" size="sm" className="w-full">
                  <Tag className="w-4 h-4 mr-2" />
                  Apply Discount
                </Button>
              </DiscountDialog>
            </div>
          )}

          <PaymentDialog
            customer={customers.find((c) => c._id === formData.customerId)}
            orderSummary={{
              services: formData.services,
              products: formData.products,
              calculations,
            }}
            onComplete={handlePaymentComplete}
            loading={loading}
          >
            <Button
              disabled={!formData.customerId || (calculations.subtotal === 0 && servicesTotal() + productTotal() === 0)}
              className="min-w-[120px]"
            >
              {loading ? <> <Loader2 className="animate-spin" /> Processing... </> : <>
                <IndianRupee className="w-4 h-4 mr-2" />
                Make Payment
              </>}

            </Button>
          </PaymentDialog>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Left Column - Form */}
        <Card className="flex-1 lg:flex-[2] p-6 rounded-lg shadow-sm">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6 p-2">
              {/* Customer Selection */}
              <div className="space-y-3">
                <Label htmlFor="customer" className="text-base font-medium">
                  Customer *
                </Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                  required
                >
                  <SelectTrigger className="h-20 ring-2 ring-border">
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


              <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-4 mt-4">

                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Services</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              services: [
                                ...prev.services,
                                {
                                  serviceId: "",
                                  serviceName: "",
                                  price: 0,
                                  gstRate: 18,
                                  providerId: "",
                                  providerName: "",
                                  duration: 0,
                                  quantity: 1,
                                },
                              ],
                            }))
                          }}
                        >
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
                                  const selectedService = services.find((s) => s._id === value)
                                  if (selectedService) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      services: prev.services.map((s, i) =>
                                        i === index
                                          ? {
                                            ...s,
                                            serviceId: value,
                                            serviceName: selectedService.name,
                                            price: selectedService.price,
                                            duration: selectedService.duration,
                                          }
                                          : s,
                                      ),
                                    }))
                                  }
                                }}
                              >
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
                              <input
                                type="number"
                                className="mt-1 w-full px-3 py-2 border rounded-md "
                                value={service.price}
                                disabled={true}
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Quantity</Label>
                              <input
                                type="number"
                                min="1"
                                className="mt-1 w-full px-3 py-2 border rounded-md"
                                value={service.quantity}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    services: prev.services.map((s, i) =>
                                      i === index ? { ...s, quantity: Number.parseInt(e.target.value) || 1 } : s,
                                    ),
                                  }))
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Salon Expert</Label>
                              <Select
                                value={service.providerId}
                                onValueChange={(value) => {
                                  const selectedProvider = providers.find((p) => p._id === value)
                                  if (selectedProvider) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      services: prev.services.map((s, i) =>
                                        i === index
                                          ? {
                                            ...s,
                                            providerId: value,
                                            providerName: selectedProvider.name,
                                          }
                                          : s,
                                      ),
                                    }))
                                  }
                                }}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select Salon Expert" />
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
                                onClick={() => handleRemoveService(service.serviceId)}
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                <Trash className="w-4 h-4 " />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.services.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No services added yet</p>
                          <p className="text-sm">Click "Add Service" to get started</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* <ServiceCard services={services} setFormData={setFormData} formData={formData} /> */}
                </TabsContent>

                <TabsContent value="products" className="space-y-4 mt-4">
                  <ProductCard setFormData={setFormData} products={products} formData={formData} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </Card>

        {/* Right Column - Bill Summary */}
        <Card className="lg:flex-1 p-6 rounded-lg shadow-sm">
          <div className="sticky top-6">
            <div className="p-4 border-b -mx-6 -mt-6 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Bill Summary
              </h3>
            </div>
            <ScrollArea className="h-[calc(100vh-350px)] py-4">
              <div className="space-y-6">
                {/* Services Breakdown */}
                {formData.services.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-semibold">Services:</div>
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm  p-4 rounded-lg bg-muted">
                        <div className="flex-1">
                          <div className="font-medium">{service.serviceName || `Service ${index + 1}`}</div>
                          <div className="text-gray-500">
                            ₹{service.price} × {service.quantity}
                          </div>
                        </div>
                        <div className="font-medium">₹{(service.price * service.quantity).toFixed(2)}</div>
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
                      <div key={index} className="flex justify-between text-sm  p-4 rounded-lg bg-muted">
                        <div className="flex-1">
                          <div className="font-medium">{product.productName || `Product ${index + 1}`}</div>
                          <div className="text-gray-500">
                            ₹{product.price} × {product.quantity}
                          </div>
                        </div>
                        <div className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</div>
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
                  <span>₹{(calculations?.subtotal || servicesTotal() + productTotal()).toFixed(2)}</span>
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
                  <span className="text-green-600">
                    ₹{(calculations.finalAmount || servicesTotal() + productTotal()).toFixed(2)}
                  </span>
                </div>


                {calculations.subtotal === 0 && servicesTotal() + productTotal() === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No items added</p>
                    <p className="text-sm">Click on service or product cards to add them</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  )
}
