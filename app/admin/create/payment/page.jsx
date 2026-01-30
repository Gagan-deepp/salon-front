"use client";

import { CreateCustomerDialog } from "@/components/admin/customer/create-customer-dialog";
import { DiscountDialog } from "@/components/admin/payment/discount-dialog";
import { PackageRedemptionDialog } from "@/components/admin/payment/package-redemption-dialog";
import { PaymentDialog } from "@/components/admin/payment/payment-dialog";
import { ProductCard } from "@/components/admin/payment/product-card";
import { PaymentSkeleton } from "@/components/admin/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCustomersDropdown } from "@/lib/actions/customer_action";
import { getOffers } from "@/lib/actions/offer_action";
import { createPayment, validatePromoCode } from "@/lib/actions/payment_action";
import { getProducts } from "@/lib/actions/product_action";
import { getServices } from "@/lib/actions/service_action";
import { getUsers } from "@/lib/actions/user_action";
import {
  Calculator,
  Crown,
  Gift,
  IndianRupee,
  Loader2,
  Plus,
  Receipt,
  Search,
  Tag,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatePaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Add loading state for initial data fetch

  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isMembershipApplied, setIsMembershipApplied] = useState(false);

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
      inclusiveGst: 0,
      inclusiveCgst: 0,
      inclusiveSgst: 0,
      inclusiveBasePrice: 0,
    },
    finalAmount: 0,
  });

  const [formData, setFormData] = useState({
    customerId: "",
    services: [],
    products: [],
    discount: {
      percentage: 0,
      promoCode: "",
    },
  });

  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find((c) => c._id === formData.customerId);
      setSelectedCustomer(customer);
      // Reset membership applied state when customer changes
      setIsMembershipApplied(false);
    } else {
      setSelectedCustomer(null);
      setIsMembershipApplied(false);
    }
  }, [formData.customerId, customers]);
  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true); // Start loading
      try {
        const [customersRes, servicesRes, productsRes, providerRes] =
          await Promise.all([
            getCustomersDropdown({ limit: 100 }),
            getServices({ limit: 100 }),
            getProducts({ limit: 100 }),
            getUsers({ page: 1, limit: 100, isActive: true }),
          ]);

        //debugger;
        if (customersRes.success && customersRes.data.data?.length > 0) {
          setCustomers(customersRes.data.data);
        }
        if (servicesRes.success && servicesRes.data.data?.length > 0) {
          setServices(servicesRes.data.data);
        }
        if (productsRes.success && productsRes.data.data?.length > 0) {
          setProducts(productsRes.data.data);
        }
        if (providerRes.success && providerRes.data.data?.length > 0) {
          setProviders(providerRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      } finally {
        setDataLoading(false); // End loading - this is crucial!
      }
    };

    fetchData();
  }, []);

  // Calculate amounts when services/products/discount change
  useEffect(() => {
    if (formData.services.length > 0 || formData.products.length > 0) {
      calculateAmounts();
    } else {
      setCalculations({
        subtotal: 0,
        servicesTotal: 0,
        productsTotal: 0,
        discount: { percentage: 0, amount: 0, promoCode: "" },
        gst: {
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0,
          inclusiveGst: 0,
          inclusiveCgst: 0,
          inclusiveSgst: 0,
          inclusiveBasePrice: 0,
        },
        finalAmount: 0,
      });
    }
  }, [formData.services, formData.products, formData.discount.percentage]);

  const handleApplyMembership = async () => {
    if (!selectedCustomer?.isMember) {
      toast.error("Customer is not a member");
      return;
    }

    try {
      // Fetch ALL active offers and find MEMBERSHIP offer
      const offerRes = await getOffers({
        limit: 100, status: "ACTIVE", isMembershipOffer: true
      });

      //debugger;
      if (offerRes.success && offerRes.data?.data?.offers?.length > 0) {
        // 🔍 Find the MEMBERSHIP offer from the response
        const membershipOffer = offerRes.data.data.offers.find(offer =>
          offer.offerCode === "MEMBERSHIP" ||
          offer.isMembershipOffer === true
        );

        //debugger;
        if (membershipOffer) {
          console.log("✅ Found MEMBERSHIP offer:", membershipOffer);


          //debugger;
          // Extract discount percentage from offer structure
          const membershipDiscount = membershipOffer.discount?.value ||
            membershipOffer.membershipBenefits?.discountPercentage ||
            membershipOffer.discountPercentage ||
            20; // Fallback

          setFormData((prev) => ({
            ...prev,
            discount: {
              ...prev.discount,
              percentage: membershipDiscount,
              promoCode: membershipOffer.offerCode || "MEMBERSHIP",
            },
          }));

          setIsMembershipApplied(true);
          toast.success(
            `🎉 Membership applied! ${membershipDiscount}% OFF from ${membershipOffer.name}`
          );
        } else {
          toast.warning("No MEMBERSHIP offer found in active offers");
        }
      } else {
        toast.error("No active offers available");
      }
    } catch (error) {
      console.error("Failed to fetch membership offer:", error);
      toast.error("Failed to apply membership discount");
    }
  };

  const calculateAmounts = async () => {
    try {
      // const payload = {
      //   services: formData.services,
      //   products: formData.products,
      //   discountPercentage: formData.discount.percentage,
      //   promoCode: formData.discount.promoCode,
      //   discount: formData.discount,
      // };

      // const result = await calculatePaymentAmount(payload);
      // if (result.success) {
      //   setCalculations(result.data.data);
      // } else {
      calculateAmountsLocally();
      // }
    } catch (error) {
      console.error("Failed to calculate amounts:", error.response);
      calculateAmountsLocally();
    }
  };

  const calculateAmountsLocally = () => {
    //debugger;
    const servicesSubtotal = servicesTotal();
    const productsSubtotal = productTotal();
    const subtotal = servicesSubtotal + productsSubtotal;

    const discountAmount = (subtotal * formData.discount.percentage) / 100;
    // const amountAfterDiscount =
    //   formData.discount.discountAmount > 0
    //     ? subtotal - discountAmount
    //     : subtotal;
    const amountAfterDiscount = formData.discount.percentage > 0 ? subtotal - subtotal * (formData.discount.percentage / 100) : subtotal;


    let totalCgst = 0;
    let totalSgst = 0;
    let totalGst = 0;
    let inclusiveCgst = 0;
    let inclusiveSgst = 0;
    let inclusiveGst = 0;

    // Calculate GST for services
    formData.services.forEach((service) => {
      const serviceTotal = service.price * service.quantity;
      const serviceDiscount =
        (serviceTotal * formData.discount.percentage) / 100;
      const serviceAfterDiscount = serviceTotal - serviceDiscount;

      const gstRate = service.gstRate || 18;

      if (service.inclusiveGst) {
        // Price already includes GST - extract the GST amount
        // Formula: Base Price = (Total Price × 100) / (100 + GST Rate)
        const basePrice = (serviceAfterDiscount * 100) / (100 + gstRate);
        const gstAmount = serviceAfterDiscount - basePrice;

        inclusiveCgst += gstAmount / 2;
        inclusiveSgst += gstAmount / 2;
        inclusiveGst += gstAmount;
      } else {
        // GST needs to be added on top of price
        const gstAmount = (serviceAfterDiscount * gstRate) / 100;

        totalCgst += gstAmount / 2;
        totalSgst += gstAmount / 2;
        totalGst += gstAmount;
      }
    });

    // Calculate GST for products
    formData.products.forEach((product) => {
      const productTotal = product.price * product.quantity;
      const productDiscount =
        (productTotal * formData.discount.percentage) / 100;
      const productAfterDiscount = productTotal - productDiscount;

      const gstRate = product.gstRate || 18;

      if (product.inclusiveGst) {
        // Price already includes GST - extract the GST amount
        const basePrice = (productAfterDiscount * 100) / (100 + gstRate);
        const gstAmount = productAfterDiscount - basePrice;

        inclusiveCgst += gstAmount / 2;
        inclusiveSgst += gstAmount / 2;
        inclusiveGst += gstAmount;
      } else {
        // GST needs to be added on top of price
        const gstAmount = (productAfterDiscount * gstRate) / 100;

        totalCgst += gstAmount / 2;
        totalSgst += gstAmount / 2;
        totalGst += gstAmount;
      }
    });

    // Final amount calculation:
    // For inclusive GST: already part of subtotal, don't add again
    // For exclusive GST: needs to be added

    debugger;
    const finalAmount = amountAfterDiscount + totalGst;

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
        cgst: totalCgst,
        sgst: totalSgst,
        igst: 0,
        total: totalGst,
        inclusiveGst: inclusiveGst,
        inclusiveCgst: inclusiveCgst,
        inclusiveSgst: inclusiveSgst,
      },
      finalAmount,
    });

    console.log("hello jay===============", calculations)
  };

  const servicesTotal = () => {
    return formData.services.reduce((total, service) => {
      return total + service.price * service.quantity;
    }, 0);
  };

  const handleRemoveService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.serviceId !== serviceId),
    }));
  };

  const productTotal = () => {
    return formData.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handlePromoCodeValidation = async () => {
    if (!formData.discount.promoCode || calculations.subtotal === 0) return;

    try {
      const result = await validatePromoCode({
        promoCode: formData.discount.promoCode,
        amount: calculations.subtotal,
        customerId: formData.customerId,
      });

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          discount: {
            ...prev.discount,
            percentage: result.data.discountPercentage,
          },
        }));
        toast.success(
          `Promo code applied! Discount: ₹${result.data.discountAmount}`
        );
      } else {
        toast.warning(`Promo code error: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Failed to validate promo code`);
    }
  };

  const handleCustomerCreated = (newCustomer) => {
    setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId: newCustomer._id,
    }));
    setCustomerSearchText(`${newCustomer.name} - ${newCustomer.phone}`);
  };

  const handleDiscountApply = (discountData) => {
    setFormData((prev) => ({
      ...prev,
      discount: discountData,
    }));
  };

  // Handle package redemption success
  const handlePackageRedemptionSuccess = (redeemedService) => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, redeemedService],
    }));
    toast.success("Package service added to bill");
  };

  const handlePaymentComplete = async (paymentData) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        ...paymentData,
        amounts: calculations,
      };

      const result = await createPayment(payload);

      if (result.success) {
        const invoice = result.data.invoice;
        const payment = result.data.payment;
        const selectedCustomer = customers.find(
          (c) => c._id === formData.customerId
        );

        const invoiceData = {
          customerInfo: {
            name: invoice.customerId?.name || selectedCustomer?.name || "N/A",
            phoneNumber:
              invoice.customerId?.phone || selectedCustomer?.phone || "N/A",
            email: invoice.customerId?.email || selectedCustomer?.email || "",
            address:
              invoice.customerId?.address || selectedCustomer?.address || "",
            modeOfPayment: payment.paymentMode || "N/A",
            placeOfSupply:
              paymentData.placeOfSupply ||
              invoice.customerId?.address?.state ||
              "N/A",
            placeOfDelivery:
              paymentData.placeOfDelivery ||
              invoice.customerId?.address?.city ||
              "N/A",
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
            invoiceDate: new Date(invoice.createdAt).toLocaleDateString(
              "en-IN"
            ),
            gstNumber: invoice.franchiseId?.gstNumber || "N/A",
            panNumber: invoice.franchiseId?.panNumber || "N/A",
            cinNumber: invoice.franchiseId?.cinNumber || "N/A",
          },
          items: [
            ...formData.services.map((s) => ({
              serviceName: s.serviceName,
              price: s.price,
              code: s.serviceCode,
              quantity: s.quantity,
              inclusiveGst: s.inclusiveGst || false,
              gstRate: s.gstRate || 18,
            })),
            ...formData.products.map((p) => ({
              productName: p.productName,
              price: p.price,
              quantity: p.quantity,
              code: p.productCode,
              inclusiveGst: s.inclusiveGst || false,
              gstRate: p.gstRate || 18,
            })),
          ],
          discount: {
            percentage: calculations.discount.percentage,
            amount: calculations.discount.amount,
          },
        };

        const response = await fetch("/api/send-invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        });

        const res = await response.json();
        toast.success(`Payment created successfully`);
        setFormData({
          customerId: "",
          services: [],
          products: [],
          discount: {
            percentage: 0,
            promoCode: "",
          },
        });
        router.refresh();
      } else {
        toast.warning(result.error);
      }
    } catch (error) {
      toast.error(`Failed to create payment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Payment</h1>
          <p className="text-gray-600">Record a new payment transaction</p>
        </div>

        {/* Header Buttons */}
        <div className="flex md:flex-row gap-4 items-center flex-wrap">
          <CreateCustomerDialog handleCustomerCreated={handleCustomerCreated}>
            <Button type="button">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </CreateCustomerDialog>

          {selectedCustomer?.isMember && !isMembershipApplied && (
            <Button
              type="button"
              variant="default"
              onClick={handleApplyMembership}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Apply Membership
            </Button>
          )}

          {/* Package Redemption Button */}
          {formData.customerId && (
            <PackageRedemptionDialog
              customerId={formData.customerId}
              services={services}
              onRedemptionSuccess={handlePackageRedemptionSuccess}
            >
              <Button type="button">
                <Gift className="w-4 h-4 mr-2" />
                Redeem Package
              </Button>
            </PackageRedemptionDialog>
          )}

          {(calculations.subtotal > 0 ||
            servicesTotal() + productTotal() > 0) && (
              <DiscountDialog
                discount={formData.discount}
                subtotal={
                  calculations.subtotal || servicesTotal() + productTotal()
                }
                customerId={formData.customerId}
                onApply={handleDiscountApply}
                onValidatePromo={handlePromoCodeValidation}
              >
                <Button type="button" variant="default" disabled={isMembershipApplied}>
                  <Tag className="w-4 h-4 mr-2" />
                  Apply Discount
                </Button>
              </DiscountDialog>
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
              disabled={
                !formData.customerId ||
                (calculations.subtotal === 0 &&
                  servicesTotal() + productTotal() === 0)
              }
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Make Payment
                </>
              )}
            </Button>
          </PaymentDialog>
        </div>
      </div>

      {dataLoading ? (
        <PaymentSkeleton />
      ) : (
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
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>

                      <input
                        id="customer-search"
                        type="text"
                        list="customers-datalist"
                        placeholder="Search customer by name or phone..."
                        className="w-full h-10 ring-2 ring-border rounded-md pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                        value={customerSearchText}
                        onChange={(e) => {
                          const searchValue = e.target.value;
                          setCustomerSearchText(searchValue);

                          const foundCustomer = customers.find(
                            (c) =>
                              c.name.toLowerCase() === searchValue.toLowerCase() ||
                              c.phone === searchValue ||
                              `${c.name} - ${c.phone}` === searchValue
                          );

                          if (foundCustomer) {
                            setFormData((prev) => ({
                              ...prev,
                              customerId: foundCustomer._id,
                            }));
                          } else {
                            setFormData((prev) => ({ ...prev, customerId: "" }));
                          }
                        }}
                        onFocus={() => {
                          if (formData.customerId) {
                            setCustomerSearchText("");
                          }
                        }}
                        required
                      />

                      <datalist id="customers-datalist">
                        {customers.map((customer) => (
                          <option
                            key={customer._id}
                            value={`${customer.name} - ${customer.phone}`}
                          />
                        ))}
                      </datalist>
                    </div>
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
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  services: [
                                    ...prev.services,
                                    {
                                      serviceId: "",
                                      serviceCode: "",
                                      serviceName: "",
                                      price: 0,
                                      gstRate: 18,
                                      providerId: "",
                                      providerName: "",
                                      duration: 0,
                                      quantity: 1,
                                    },
                                  ],
                                }));
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Service
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {formData.services.map((service, index) => (
                            <div
                              key={index}
                              className="p-4 border rounded-lg space-y-4"
                            >
                              {/* Package Badge */}
                              {service.isPackageRedemption && (
                                <Badge variant="secondary" className="mb-2">
                                  <Gift className="w-3 h-3 mr-1" />
                                  Package: {service.packageName}
                                </Badge>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="md:col-span-2 lg:col-span-1">
                                  <Label className="text-sm font-medium">
                                    Service
                                  </Label>
                                  <Select
                                    value={service.serviceId}
                                    disabled={service.isPackageRedemption}
                                    onValueChange={(value) => {
                                      const selectedService = services.find(
                                        (s) => s._id === value
                                      );
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
                                              serviceCode: selectedService.code,
                                              duration:
                                                selectedService.duration,
                                              gstRate: selectedService.gstRate,
                                              inclusiveGst:
                                                selectedService.inclusiveGST,
                                            }
                                            : s
                                        ),
                                      }));
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="mt-1 w-full">
                                      <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {services.map((s) => (
                                        <SelectItem key={s._id} value={s._id}>
                                          <div className="flex items-center gap-2">
                                            <span>{s.name}</span>
                                            <span className="text-sm">
                                              - ₹{s.price}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Price
                                  </Label>
                                  <input
                                    type="number"
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                    value={service.price}
                                    disabled={true}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Quantity
                                  </Label>
                                  <input
                                    type="number"
                                    min="1"
                                    disabled={service.isPackageRedemption}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                    value={service.quantity}
                                    onChange={(e) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        services: prev.services.map((s, i) =>
                                          i === index
                                            ? {
                                            ...s,
                                            quantity:
                                              Number.parseInt(e.target.value) ||
                                              1,
                                          }
                                          : s
                                      ),
                                    }));
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {!service.isPackageRedemption && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Salon Expert
                                    </Label>
                                    <Select
                                      value={service.providerId}
                                      onValueChange={(value) => {
                                        const selectedProvider = providers.find(
                                          (p) => p._id === value
                                        );
                                        if (selectedProvider) {
                                          setFormData((prev) => ({
                                            ...prev,
                                            services: prev.services.map((s, i) =>
                                              i === index
                                                ? {
                                                ...s,
                                                providerId: value,
                                                providerName:
                                                  selectedProvider.name,
                                              }
                                              : s
                                          ),
                                        }));
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select Salon Expert" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {providers.map((provider) => (
                                          <SelectItem
                                            key={provider._id}
                                            value={provider._id}
                                          >
                                            <div className="flex gap-2">
                                              <span className="font-medium">
                                                {provider.name}
                                              </span>
                                              <span className="text-sm">
                                                {provider.role}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                <div className="flex items-end justify-between">
                                  <div className="flex-1 mr-4">
                                    <Label className="text-sm font-medium">
                                      Total
                                    </Label>
                                    <div className="text-lg font-semibold text-green-600 mt-1">
                                      ₹
                                      {(service.price * service.quantity).toFixed(
                                        2
                                      )}
                                      {service.isPackageRedemption && (
                                        <span className="text-xs text-gray-500 ml-2">
                                          (Free)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveService(service.serviceId)
                                    }
                                    className="text-red-600 hover:text-red-700 cursor-pointer"
                                  >
                                    <Trash className="w-4 h-4" />
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
                              <p className="text-lg font-medium">
                                No services added yet
                              </p>
                              <p className="text-sm">
                                Click "Add Service" or "Redeem Package" to get
                                started
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* <ServiceCard services={services} setFormData={setFormData} formData={formData} /> */}
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4 mt-4">
                      <ProductCard
                        setFormData={setFormData}
                        products={products}
                        formData={formData}
                      />
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
                <ScrollArea className="h-[calc(100vh-350px)] py-4 overflow-y-scroll no-scrollbar">
                  <div className="space-y-6">
                    {/* Services Breakdown */}
                    {formData.services.length > 0 && (
                      <div className="space-y-3">
                        <div className="font-semibold">Services:</div>
                        {formData.services.map((service, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm  p-4 rounded-lg bg-muted"
                          >
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {service.serviceName || `Service ${index + 1}`}
                                {service.isPackageRedemption && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Gift className="w-2 h-2 mr-1" />
                                    Package
                                  </Badge>
                                )}
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
                            className="flex justify-between text-sm  p-4 rounded-lg bg-muted"
                          >
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
                      <span>
                        ₹
                        {(
                          calculations?.subtotal || servicesTotal() + productTotal()
                        ).toFixed(2)}
                      </span>
                    </div>

                    {/* Discount */}
                    {calculations.discount.amount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <div className="flex items-center space-x-2">
                          <span>
                            Discount ({calculations.discount.percentage}%)
                          </span>
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
                        <span>
                          ₹
                          {(
                            calculations.subtotal - calculations.discount.amount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    {/* GST Breakdown */}
                    {/* GST Breakdown */}
                    {calculations.gst.inclusiveGst > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CGST:</span>
                          <span>₹{calculations.gst.inclusiveCgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SGST:</span>
                          <span>₹{calculations.gst.inclusiveSgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span>Total Inclusive GST:</span>
                          <span>₹{calculations.gst.inclusiveGst.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {calculations.gst.total > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CGST:</span>
                          <span>₹{calculations.gst.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SGST:</span>
                          <span>₹{calculations.gst.sgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span>Total Exclusive GST:</span>
                          <span>₹{calculations.gst.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Final Amount */}
                    <div className="flex justify-between text-xl font-bold">
                      <span>Final Amount:</span>
                      <span className="text-green-600">
                        ₹
                        {(
                          calculations.finalAmount ||
                          servicesTotal() + productTotal()
                        ).toFixed(2)}
                      </span>
                    </div>

                    {calculations.subtotal === 0 &&
                      servicesTotal() + productTotal() === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No items added</p>
                          <p className="text-sm">
                            Add services, products, or redeem packages
                          </p>
                        </div>
                      )}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>
      )}
    </div>
  );
}
