"use client";

import { CreateCustomerDialog } from "@/components/admin/customer/create-customer-dialog";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getCustomersDropdown } from "@/lib/actions/customer_action";
import { getOffers } from "@/lib/actions/offer_action"; // You'll need this
import { purchaseMembership } from "@/lib/actions/membership_action"; // You'll need this
import {
  Loader2,
  Plus,
  Receipt,
  Search,
  Crown,
  Gift,
  Percent,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PurchaseMembershipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [offerCode, setOfferCode] = useState("");

  const [selectedOffer, setSelectedOffer] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "",
    offerId: "",
    amountPaid: "",
    quantity: 1,
    paymentMode: "CASH",
    paymentDetails: {},
    offerCode: "",
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, offersRes] = await Promise.all([
          getCustomersDropdown({ limit: 100 }),
          getOffers({ limit: 100, status: "ACTIVE", isMembershipOffer: true }),
        ]);

        if (customersRes.success && customersRes.data.data?.length > 0) {
          setCustomers(customersRes.data.data);
        }
        console.log("offerRes", offersRes)
        if (offersRes.success && offersRes.data.data.offers?.length > 0) {
          setOffers(offersRes.data.data.offers);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleCustomerCreated = (newCustomer) => {
    setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerId: newCustomer._id,
    }));
    setCustomerSearchText(`${newCustomer.name} - ${newCustomer.phone}`);
  };

  const handleOfferSelect = (offerId) => {
    const offer = offers.find((o) => o._id === offerId);
    if (offer) {
      setSelectedOffer(offer);
      setFormData((prev) => ({
        ...prev,
        offerId: offerId,
        amountPaid: offer.membershipBenefits?.price || 0,
        quantity: 1,
      }));
    }
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, amountPaid: amount }));
  };

  const handleOfferCodeChange = (e) => {
    setOfferCode(e.target.value.toUpperCase());
    setFormData((prev) => ({ ...prev, offerCode: e.target.value.toUpperCase() }));
  };

  const calculateTotal = () => {
    if (!selectedOffer) return formData.amountPaid;
    return formData.amountPaid * formData.quantity;
  };

  const getMinimumAmount = () => {
    if (!selectedOffer?.membershipBenefits?.membershipValue) return 0;
    return selectedOffer.membershipBenefits.membershipValue * 0.5;
  };

  const isAmountValid = () => {
    if (!selectedOffer?.membershipBenefits?.membershipValue) return true;
    return formData.amountPaid >= getMinimumAmount();
  };

  const handlePurchase = async () => {
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.offerId) {
      toast.error("Please select an offer");
      return;
    }
    if (formData.amountPaid <= 0) {
      toast.error("Please enter valid amount");
      return;
    }
    if (!isAmountValid()) {
      toast.error(`Amount paid must be at least ₹${getMinimumAmount().toFixed(2)} (50% of membership value)`);
      return;
    }

    setLoading(true);
    try {
      const result = await purchaseMembership(formData);

      if (result.success) {
        // Prepare invoice data - using only the data we get from API
        const invoiceData = {
          membershipData: result.data, // Contains membership, customer, and franchise data
          notes: "Thank you for choosing our membership program!"
        };

        const response = await fetch("/api/send-member-invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        });

        toast.success("Membership purchased successfully!");
        // Reset form
        setFormData({
          customerId: "",
          offerId: "",
          amountPaid: 0,
          quantity: 1,
          paymentMode: "CASH",
          paymentDetails: {},
          offerCode: "",
        });
        setSelectedOffer(null);
        setCustomerSearchText("");
        setOfferCode("");
      } else {
        toast.error(result.error || "Failed to purchase membership");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to purchase membership");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Purchase Membership
          </h1>
          <p className="text-muted-foreground">Convert customer to premium member</p>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <CreateCustomerDialog handleCustomerCreated={handleCustomerCreated}>
            <Button type="button">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </CreateCustomerDialog>

          <Button
            onClick={handlePurchase}
            disabled={!formData.customerId || !formData.offerId || loading}
            className="min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Buy Membership
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Left Column - Form */}
        <Card className="flex-1 lg:flex-[2] p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
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

              <Separator />

              {/* Offer Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Membership Offers *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer) => (
                    <div
                      key={offer._id}
                      onClick={() => handleOfferSelect(offer._id)}
                      className={`
                        relative group p-6 border-2 rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-xl backdrop-blur-sm
                        ${selectedOffer?._id === offer._id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                          : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/5 hover:shadow-primary/5"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Crown className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-foreground">{offer.name}</h3>
                            <p className="text-sm text-primary font-medium">
                              {offer.offerCode}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                          {offer.offerType}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{offer.description}</p>

                      {offer.membershipBenefits && (
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-muted-foreground">Membership Value:</span>
                            <span className="font-bold text-lg text-foreground">₹{offer.membershipBenefits.membershipValue}</span>
                          </div>

                          <div className="flex justify-between text-sm pt-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              1 Year
                            </span>
                            <span className="font-medium text-primary">Active</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {offers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Crown className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-lg font-medium">No membership offers available</p>
                    <p className="text-sm">Please create membership offers first</p>
                  </div>
                )}
              </div>

              {/* Promo Code */}


              {/* Amount */}
              {selectedOffer && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Amount Paid (₹)*</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount paid"
                      value={formData.amountPaid}
                      onChange={handleAmountChange}
                      className={`h-10 text-lg font-medium ${!isAmountValid() ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      min="0"
                      step="0.01"
                    />
                    {selectedOffer?.membershipBenefits?.membershipValue && (
                      <div className="space-y-2">
                        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Minimum required (50%):</span>
                          <span className="font-semibold text-foreground">₹{getMinimumAmount().toFixed(2)}</span>
                        </div> */}
                        {!isAmountValid() && formData.amountPaid > 0 && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-destructive">
                              At least 50% of membership value (₹{getMinimumAmount().toFixed(2)}) is required
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Payment Mode */}
              {selectedOffer && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Payment Mode *</Label>
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, paymentMode: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Column - Summary */}
        <Card className="lg:flex-1 p-6 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
          <div className="sticky top-6">
            <div className="p-4 border-b -mx-6 -mt-6 rounded-t-3xl bg-gradient-to-r from-primary/5 to-secondary/5">
              <h3 className="text-lg font-semibold flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-primary" />
                Membership Summary
              </h3>
            </div>
            <ScrollArea className="h-[calc(100vh-350px)] py-4">
              <div className="space-y-6">
                {selectedOffer ? (
                  <>
                    {/* Selected Offer Details */}
                    <div className="space-y-3">
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" />
                        {selectedOffer.name}
                      </div>
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Membership Value:</span>
                            <span className="font-bold text-foreground">₹{selectedOffer.membershipBenefits?.membershipValue}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount Paid:</span>
                            <span className="font-bold text-lg text-primary">₹{formData.amountPaid.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount Given:</span>
                            <span className="font-bold text-lg text-primary">₹{(selectedOffer.membershipBenefits?.membershipValue - formData.amountPaid).toFixed(2)}</span>
                          </div>

                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Total Calculation */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-2xl backdrop-blur-sm">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount per membership:</span>
                        <span className="text-foreground">₹{formData.amountPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="text-foreground">× {formData.quantity}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl font-bold text-primary">
                        <span>Total Amount:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 p-4 rounded-2xl backdrop-blur-sm">
                      <p className="font-semibold text-accent flex items-center gap-2 mb-3">
                        <Gift className="w-5 h-5" />
                        Membership Benefits:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-center gap-2">✅ {selectedOffer.membershipBenefits?.discountPercentage}% discount on all services</li>
                        <li className="flex items-center gap-2">✅ Priority booking & appointments</li>
                        <li className="flex items-center gap-2">✅ ₹{selectedOffer.membershipBenefits?.membershipValue} worth of services</li>
                        <li className="flex items-center gap-2">✅ Valid for 1 year</li>
                      </ul>
                    </div>
                  </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Crown className="w-16 h-16 mx-auto mb-4 opacity-30 text-primary/30" />
                    <p className="text-lg font-medium">No offer selected</p>
                    <p className="text-sm">Select a customer and membership offer</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
}