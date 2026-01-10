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
import { getCustomersDropdown } from "@/lib/actions/customer_action";
import { getPackages } from "@/lib/actions/package_actions"; // You'll need this
import { purchasePackage } from "@/lib/actions/package_actions"; // You'll need this
import {
  IndianRupee,
  Loader2,
  Plus,
  Receipt,
  Search,
  Trash,
  Package as PackageIcon,
  Gift,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BuyPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [customerSearchText, setCustomerSearchText] = useState("");

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [formData, setFormData] = useState({
    customerId: "",
    packageId: "",
    quantity: 1,
    paymentMode: "CASH",
    paymentDetails: {},
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, packagesRes] = await Promise.all([
          getCustomersDropdown({ limit: 100 }),
          getPackages({ limit: 100, status: "ACTIVE" }),
        
        ]);

        if (customersRes.success && customersRes.data.data?.length > 0) {
          setCustomers(customersRes.data.data);
        }
        debugger;
        if (packagesRes.success && packagesRes.data?.length > 0) {
            debugger;
            console.log("packageRes",packagesRes.data)
          setPackages(packagesRes.data);
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

  const handlePackageSelect = (packageId) => {
    const pkg = packages.find((p) => p._id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setFormData((prev) => ({
        ...prev,
        packageId: packageId,
        quantity: 1,
      }));
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity) || 1);
    setQuantity(qty);
    setFormData((prev) => ({
      ...prev,
      quantity: qty,
    }));
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price * quantity;
  };

  const calculateSavings = () => {
    if (!selectedPackage) return 0;
    const savings = selectedPackage.value - selectedPackage.price;
    return savings * quantity;
  };

  const handlePurchase = async () => {
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.packageId) {
      toast.error("Please select a package");
      return;
    }

    setLoading(true);
    try {
      const result = await purchasePackage(formData);

      if (result.success) {
        toast.success("Package purchased successfully!");
        // Reset form
        setFormData({
          customerId: "",
          packageId: "",
          quantity: 1,
          paymentMode: "CASH",
          paymentDetails: {},
        });
        setSelectedPackage(null);
        setQuantity(1);
        setCustomerSearchText("");
        // Optionally redirect
        // router.push("/admin/packages");
      } else {
        toast.error(result.error || "Failed to purchase package");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to purchase package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Buy Package</h1>
          <p className="text-gray-600">Purchase a package for a customer</p>
        </div>

        {/* Header Buttons */}
        <div className="flex gap-4 items-center flex-wrap">
          <CreateCustomerDialog handleCustomerCreated={handleCustomerCreated}>
            <Button type="button">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </CreateCustomerDialog>

          <Button
            onClick={handlePurchase}
            disabled={
              !formData.customerId || !formData.packageId || loading
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
                Purchase Package
              </>
            )}
          </Button>
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

              <Separator />

              {/* Package Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Select Package *
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg._id}
                      onClick={() => handlePackageSelect(pkg._id)}
                      className={`
                        p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${
                          selectedPackage?._id === pkg._id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PackageIcon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{pkg.name}</h3>
                        </div>
                        {/* {pkg.type && (
                          <Badge variant="secondary">{pkg.type}</Badge>
                        )} */}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {pkg.description || "No description available"}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Package Value:</span>
                          <span className="font-medium">₹{pkg.totalValue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-bold text-green-600">
                            ₹{pkg.price}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">You Save:</span>
                          <span className="font-medium text-orange-600">
                            ₹{pkg.totalValue - pkg.price}
                          </span>
                        </div>
                        {pkg.validity && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Validity:</span>
                            <span className="font-medium">
                              {pkg.validity} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {packages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <PackageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">No packages available</p>
                    <p className="text-sm">
                      Please add packages to get started
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Selection */}
              {selectedPackage && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Quantity</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min="1"
                        className="w-20 px-3 py-2 border rounded-md text-center"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Payment Mode Selection */}
              {selectedPackage && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Payment Mode *
                    </Label>
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMode: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                        <SelectItem value="WALLET">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Column - Summary */}
        <Card className="lg:flex-1 p-6 rounded-lg shadow-sm">
          <div className="sticky top-6">
            <div className="p-4 border-b -mx-6 -mt-6 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Purchase Summary
              </h3>
            </div>
            <ScrollArea className="h-[calc(100vh-350px)] py-4">
              <div className="space-y-6">
                {selectedPackage ? (
                  <>
                    {/* Selected Package Details */}
                    <div className="space-y-3">
                      <div className="font-semibold">Selected Package:</div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-5 h-5 text-primary" />
                          <div className="font-medium text-lg">
                            {selectedPackage.name}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Package Value:</span>
                            <span>₹{selectedPackage.totalValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Price per unit:</span>
                            <span>₹{selectedPackage.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Quantity:</span>
                            <span>× {quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Calculation Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Package Price:</span>
                        <span>₹{selectedPackage.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity:</span>
                        <span>× {quantity}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-semibold">
                        <span>Subtotal:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>

                      {calculateSavings() > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Total Savings:</span>
                          <span>₹{calculateSavings().toFixed(2)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-xl font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">
                          ₹{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                      <p className="font-semibold mb-1">📦 Package Benefits:</p>
                      <p>
                        Customer will receive ₹{selectedPackage.totalValue * quantity} 
                          worth of services for just ₹{calculateTotal().toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No package selected</p>
                    <p className="text-sm">
                      Select a customer and package to see summary
                    </p>
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
