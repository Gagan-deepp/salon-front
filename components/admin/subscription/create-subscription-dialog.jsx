"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createSubscription } from "@/lib/actions/subscription_action"
import { useForm } from "@tanstack/react-form"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

const subscriptionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tier: z.enum(["SOLO_BASIC", "SOLO_ADVANCED", "SMALL_ENTERPRISE", "FULL_ENTERPRISE"]),

  // Pricing
  basePrice: z.number().min(0, "Base price must be 0 or greater"),
  perStorePrice: z.number().min(0, "Per store price must be 0 or greater"),
  currency: z.string().default("USD"),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  setupFee: z.number().min(0, "Setup fee must be 0 or greater").default(0),

  // Limits
  maxStores: z.number().min(1, "Max stores must be at least 1"),
  maxUsers: z.number().min(1, "Max users must be at least 1"),
  dataRetentionYears: z.number().min(1, "Data retention must be at least 1 year").default(1),
  additionalStorePrice: z.number().min(0).default(0),

  // Support
  supportLevel: z.enum(["EMAIL", "PRIORITY_EMAIL", "PHONE_EMAIL", "DEDICATED_24X7"]),
  responseTime: z.string(),
  slaUptime: z.number().min(0).max(100).default(99.0),

  // Status
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().default(0),
})



export function CreateSubscriptionDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [features, setFeatures] = useState({
    billing: {
      enabled: true,
      serviceBilling: true,
      productBilling: true,
      multiplePaymentMethods: true,
      endOfDayReconciliation: true,
    },
    customerManagement: {
      enabled: true,
      basicClientData: true,
      visitHistory: true,
      unifiedDatabase: false,
      customerSegmentation: false,
    },
    communication: {
      enabled: false,
      whatsappBilling: false,
      smsBilling: false,
      messageRate: 5,
      automatedReminders: false,
      campaignManager: false,
    },
    loyalty: {
      enabled: false,
      loyaltyPoints: false,
      packages: false,
      discountEngine: false,
      sharedLoyalty: false,
    },
    inventory: {
      enabled: false,
      realTimeTracking: false,
      lowStockAlerts: false,
      consumptionReports: false,
      predictiveInventory: false,
    },
    staffManagement: {
      enabled: false,
      roleBasedAccess: false,
      performanceTracking: false,
      incentiveCalculation: false,
      staffingForecasts: false,
    },
    analytics: {
      enabled: false,
      dailyMonthlySummary: true,
      advancedDashboard: false,
      serviceMixReports: false,
      peakHourAnalysis: false,
      predictiveAnalytics: false,
      geoSpatialMapping: false,
      benchmarkingReports: false,
    },
    multiStore: {
      enabled: false,
      centralizedDashboard: false,
      aggregatedReports: false,
      storeComparison: false,
      centralizedPricing: false,
      brandControl: false,
    },
    enterprise: {
      enabled: false,
      apiAccess: false,
      customIntegrations: false,
      whiteLabelApp: false,
      auditTrails: false,
      royaltyManagement: false,
      complianceReports: false,
      dedicatedAccountManager: false,
    },
  })

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      tier: "SOLO_BASIC",
      basePrice: 0,
      perStorePrice: 0,
      currency: "USD",
      billingCycle: "MONTHLY",
      setupFee: 0,
      maxStores: 1,
      maxUsers: 1,
      dataRetentionYears: 1,
      additionalStorePrice: 0,
      supportLevel: "EMAIL",
      responseTime: "48 hours",
      slaUptime: 99.0,
      isActive: true,
      isVisible: true,
      sortOrder: 0,
    },
    defaultState: {
      canSubmit: true
    },
    canSubmitWhenInvalid: true,
    validators: {
      onChange: subscriptionSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const payload = {
            name: value.name,
            displayName: value.displayName,
            description: value.description,
            tier: value.tier,
            pricing: {
              basePrice: value.basePrice,
              perStorePrice: value.perStorePrice,
              currency: value.currency,
              billingCycle: value.billingCycle,
              setupFee: value.setupFee,
            },
            limits: {
              maxStores: value.maxStores,
              maxUsers: value.maxUsers,
              dataRetention: { years: value.dataRetentionYears },
              additionalStorePrice: value.additionalStorePrice,
            },
            features,
            support: {
              level: value.supportLevel,
              responseTime: value.responseTime,
              slaUptime: value.slaUptime,
            },
            isActive: value.isActive,
            isVisible: value.isVisible,
            sortOrder: value.sortOrder,
            addOns: [],
          }

          const result = await createSubscription(payload)

          if (result.success) {
            toast.success("Subscription created successfully")
            form.reset()
            setFeatures({
              billing: {
                enabled: true,
                serviceBilling: true,
                productBilling: true,
                multiplePaymentMethods: true,
                endOfDayReconciliation: true,
              },
              customerManagement: {
                enabled: true,
                basicClientData: true,
                visitHistory: true,
                unifiedDatabase: false,
                customerSegmentation: false,
              },
              communication: {
                enabled: false,
                whatsappBilling: false,
                smsBilling: false,
                messageRate: 5,
                automatedReminders: false,
                campaignManager: false,
              },
              loyalty: {
                enabled: false,
                loyaltyPoints: false,
                packages: false,
                discountEngine: false,
                sharedLoyalty: false,
              },
              inventory: {
                enabled: false,
                realTimeTracking: false,
                lowStockAlerts: false,
                consumptionReports: false,
                predictiveInventory: false,
              },
              staffManagement: {
                enabled: false,
                roleBasedAccess: false,
                performanceTracking: false,
                incentiveCalculation: false,
                staffingForecasts: false,
              },
              analytics: {
                enabled: false,
                dailyMonthlySummary: true,
                advancedDashboard: false,
                serviceMixReports: false,
                peakHourAnalysis: false,
                predictiveAnalytics: false,
                geoSpatialMapping: false,
                benchmarkingReports: false,
              },
              multiStore: {
                enabled: false,
                centralizedDashboard: false,
                aggregatedReports: false,
                storeComparison: false,
                centralizedPricing: false,
                brandControl: false,
              },
              enterprise: {
                enabled: false,
                apiAccess: false,
                customIntegrations: false,
                whiteLabelApp: false,
                auditTrails: false,
                royaltyManagement: false,
                complianceReports: false,
                dedicatedAccountManager: false,
              },
            })
            router.refresh()
            setOpen(false)
          } else {
            toast.warning(result.error || "Failed to create subscription")
          }
        } catch (error) {
          toast.error("An unexpected error occurred")
        }
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>Configure a new subscription plan with pricing, limits, and features</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Limits</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="support">Support & Status</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <form.Field
                  name="name"
                  children={(field) => (
                    <Field>
                      <label htmlFor="name" className="text-sm font-medium">
                        Name (Internal) *
                      </label>
                      <Input
                        id="name"
                        placeholder="solo-basic"
                        disabled={isPending}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="displayName"
                  children={(field) => (
                    <Field>
                      <label htmlFor="displayName" className="text-sm font-medium">
                        Display Name *
                      </label>
                      <Input
                        id="displayName"
                        placeholder="Solo Basic"
                        disabled={isPending}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="description"
                  children={(field) => (
                    <Field>
                      <label htmlFor="description" className="text-sm font-medium">
                        Description *
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Perfect for solo practitioners..."
                        disabled={isPending}
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="tier"
                  children={(field) => (
                    <Field>
                      <label htmlFor="tier" className="text-sm font-medium">
                        Tier *
                      </label>
                      <Select
                        disabled={isPending}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id="tier">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLO_BASIC">Solo Basic</SelectItem>
                          <SelectItem value="SOLO_ADVANCED">Solo Advanced</SelectItem>
                          <SelectItem value="SMALL_ENTERPRISE">Small Enterprise</SelectItem>
                          <SelectItem value="FULL_ENTERPRISE">Full Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="basePrice"
                    children={(field) => (
                      <Field>
                        <label htmlFor="basePrice" className="text-sm font-medium">
                          Base Price *
                        </label>
                        <Input
                          id="basePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                        )}
                      </Field>
                    )}
                  />

                  <form.Field
                    name="perStorePrice"
                    children={(field) => (
                      <Field>
                        <label htmlFor="perStorePrice" className="text-sm font-medium">
                          Per Store Price *
                        </label>
                        <Input
                          id="perStorePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <form.Field
                    name="currency"
                    children={(field) => (
                      <Field>
                        <label htmlFor="currency" className="text-sm font-medium">
                          Currency
                        </label>
                        <Input
                          id="currency"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  />

                  <form.Field
                    name="billingCycle"
                    children={(field) => (
                      <Field>
                        <label htmlFor="billingCycle" className="text-sm font-medium">
                          Billing Cycle *
                        </label>
                        <Select
                          disabled={isPending}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger id="billingCycle">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />

                  <form.Field
                    name="setupFee"
                    children={(field) => (
                      <Field>
                        <label htmlFor="setupFee" className="text-sm font-medium">
                          Setup Fee
                        </label>
                        <Input
                          id="setupFee"
                          type="number"
                          min="0"
                          step="0.01"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-4">Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name="maxStores"
                      children={(field) => (
                        <Field>
                          <label htmlFor="maxStores" className="text-sm font-medium">
                            Max Stores *
                          </label>
                          <Input
                            id="maxStores"
                            type="number"
                            min="1"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />

                    <form.Field
                      name="maxUsers"
                      children={(field) => (
                        <Field>
                          <label htmlFor="maxUsers" className="text-sm font-medium">
                            Max Users *
                          </label>
                          <Input
                            id="maxUsers"
                            type="number"
                            min="1"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />

                    <form.Field
                      name="dataRetentionYears"
                      children={(field) => (
                        <Field>
                          <label htmlFor="dataRetentionYears" className="text-sm font-medium">
                            Data Retention (Years)
                          </label>
                          <Input
                            id="dataRetentionYears"
                            type="number"
                            min="1"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                        </Field>
                      )}
                    />

                    <form.Field
                      name="additionalStorePrice"
                      children={(field) => (
                        <Field>
                          <label htmlFor="additionalStorePrice" className="text-sm font-medium">
                            Additional Store Price
                          </label>
                          <Input
                            id="additionalStorePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-4">
                <div className="space-y-6">
                  {/* Billing Features */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox
                        id="billing-enabled"
                        checked={features.billing.enabled}
                        onCheckedChange={(checked) =>
                          setFeatures((prev) => ({
                            ...prev,
                            billing: { ...prev.billing, enabled: checked },
                          }))
                        }
                      />
                      <label htmlFor="billing-enabled" className="font-semibold">
                        Billing & POS
                      </label>
                    </div>
                    {features.billing.enabled && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="serviceBilling"
                            checked={features.billing.serviceBilling}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                billing: { ...prev.billing, serviceBilling: checked },
                              }))
                            }
                          />
                          <label htmlFor="serviceBilling" className="text-sm">
                            Service Billing
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="productBilling"
                            checked={features.billing.productBilling}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                billing: { ...prev.billing, productBilling: checked },
                              }))
                            }
                          />
                          <label htmlFor="productBilling" className="text-sm">
                            Product Billing
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="multiplePaymentMethods"
                            checked={features.billing.multiplePaymentMethods}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                billing: { ...prev.billing, multiplePaymentMethods: checked },
                              }))
                            }
                          />
                          <label htmlFor="multiplePaymentMethods" className="text-sm">
                            Multiple Payment Methods
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="endOfDayReconciliation"
                            checked={features.billing.endOfDayReconciliation}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                billing: { ...prev.billing, endOfDayReconciliation: checked },
                              }))
                            }
                          />
                          <label htmlFor="endOfDayReconciliation" className="text-sm">
                            End of Day Reconciliation
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Management */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox
                        id="customerManagement-enabled"
                        checked={features.customerManagement.enabled}
                        onCheckedChange={(checked) =>
                          setFeatures((prev) => ({
                            ...prev,
                            customerManagement: { ...prev.customerManagement, enabled: checked },
                          }))
                        }
                      />
                      <label htmlFor="customerManagement-enabled" className="font-semibold">
                        Customer Management
                      </label>
                    </div>
                    {features.customerManagement.enabled && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="basicClientData"
                            checked={features.customerManagement.basicClientData}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                customerManagement: { ...prev.customerManagement, basicClientData: checked },
                              }))
                            }
                          />
                          <label htmlFor="basicClientData" className="text-sm">
                            Basic Client Data
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="visitHistory"
                            checked={features.customerManagement.visitHistory}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                customerManagement: { ...prev.customerManagement, visitHistory: checked },
                              }))
                            }
                          />
                          <label htmlFor="visitHistory" className="text-sm">
                            Visit History
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="unifiedDatabase"
                            checked={features.customerManagement.unifiedDatabase}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                customerManagement: { ...prev.customerManagement, unifiedDatabase: checked },
                              }))
                            }
                          />
                          <label htmlFor="unifiedDatabase" className="text-sm">
                            Unified Database
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="customerSegmentation"
                            checked={features.customerManagement.customerSegmentation}
                            onCheckedChange={(checked) =>
                              setFeatures((prev) => ({
                                ...prev,
                                customerManagement: {
                                  ...prev.customerManagement,
                                  customerSegmentation: checked,
                                },
                              }))
                            }
                          />
                          <label htmlFor="customerSegmentation" className="text-sm">
                            Customer Segmentation
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add more feature categories as needed - keeping it shorter for brevity */}
                  <p className="text-sm text-muted-foreground italic">
                    Additional feature categories (Communication, Loyalty, Inventory, etc.) can be configured after
                    creation
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 mt-4">
                <form.Field
                  name="supportLevel"
                  children={(field) => (
                    <Field>
                      <label htmlFor="supportLevel" className="text-sm font-medium">
                        Support Level *
                      </label>
                      <Select
                        disabled={isPending}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id="supportLevel">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email Support</SelectItem>
                          <SelectItem value="PRIORITY_EMAIL">Priority Email</SelectItem>
                          <SelectItem value="PHONE_EMAIL">Phone & Email</SelectItem>
                          <SelectItem value="DEDICATED_24X7">Dedicated 24/7</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="responseTime"
                    children={(field) => (
                      <Field>
                        <label htmlFor="responseTime" className="text-sm font-medium">
                          Response Time
                        </label>
                        <Input
                          id="responseTime"
                          placeholder="24 hours"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  />

                  <form.Field
                    name="slaUptime"
                    children={(field) => (
                      <Field>
                        <label htmlFor="slaUptime" className="text-sm font-medium">
                          SLA Uptime (%)
                        </label>
                        <Input
                          id="slaUptime"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-4">Status & Visibility</h4>
                  <div className="space-y-4">
                    <form.Field
                      name="isActive"
                      children={(field) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="isActive"
                            checked={field.state.value}
                            onCheckedChange={(checked) => field.handleChange(checked)}
                          />
                          <label htmlFor="isActive" className="text-sm">
                            Is Active
                          </label>
                        </div>
                      )}
                    />

                    <form.Field
                      name="isVisible"
                      children={(field) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="isVisible"
                            checked={field.state.value}
                            onCheckedChange={(checked) => field.handleChange(checked)}
                          />
                          <label htmlFor="isVisible" className="text-sm">
                            Is Visible (Show on pricing page)
                          </label>
                        </div>
                      )}
                    />

                    <form.Field
                      name="sortOrder"
                      children={(field) => (
                        <Field>
                          <label htmlFor="sortOrder" className="text-sm font-medium">
                            Sort Order
                          </label>
                          <Input
                            id="sortOrder"
                            type="number"
                            disabled={isPending}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                          />
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting || isPending} className="w-full">
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Subscription...
                    </>
                  ) : (
                    "Create Subscription Plan"
                  )}
                </Button>
              )}
            />
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
