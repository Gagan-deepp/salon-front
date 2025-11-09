"use client"

import { useState, useTransition, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { updateSubscription } from "@/lib/actions/subscription_action"

const subscriptionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tier: z.enum(["SOLO_BASIC", "SOLO_ADVANCED", "SMALL_ENTERPRISE", "FULL_ENTERPRISE"]),
  basePrice: z.number().min(0, "Base price must be 0 or greater"),
  perStorePrice: z.number().min(0, "Per store price must be 0 or greater"),
  currency: z.string().default("USD"),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  setupFee: z.number().min(0, "Setup fee must be 0 or greater").default(0),
  maxStores: z.number().min(1, "Max stores must be at least 1"),
  maxUsers: z.number().min(1, "Max users must be at least 1"),
  dataRetentionYears: z.number().min(1, "Data retention must be at least 1 year").default(1),
  additionalStorePrice: z.number().min(0).default(0),
  supportLevel: z.enum(["EMAIL", "PRIORITY_EMAIL", "PHONE_EMAIL", "DEDICATED_24X7"]),
  responseTime: z.string(),
  slaUptime: z.number().min(0).max(100).default(99.0),
  isActive: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().default(0),
})

export function UpdateSubscriptionDialog({ children, subscription }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [features, setFeatures] = useState(subscription.features || {})
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: subscription.name,
      displayName: subscription.displayName,
      description: subscription.description,
      tier: subscription.tier,
      basePrice: subscription.pricing?.basePrice || 0,
      perStorePrice: subscription.pricing?.perStorePrice || 0,
      currency: subscription.pricing?.currency || "USD",
      billingCycle: subscription.pricing?.billingCycle || "MONTHLY",
      setupFee: subscription.pricing?.setupFee || 0,
      maxStores: subscription.limits?.maxStores || 1,
      maxUsers: subscription.limits?.maxUsers || 1,
      dataRetentionYears: subscription.limits?.dataRetention?.years || 1,
      additionalStorePrice: subscription.limits?.additionalStorePrice || 0,
      supportLevel: subscription.support?.level || "EMAIL",
      responseTime: subscription.support?.responseTime || "48 hours",
      slaUptime: subscription.support?.slaUptime || 99.0,
      isActive: subscription.isActive ?? true,
      isVisible: subscription.isVisible ?? true,
      sortOrder: subscription.sortOrder || 0,
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
          }

          const result = await updateSubscription(subscription._id, payload)

          if (result.success) {
            toast.success("Subscription updated successfully")
            router.refresh()
            setOpen(false)
          } else {
            toast.warning(result.error || "Failed to update subscription")
          }
        } catch (error) {
          toast.error("An unexpected error occurred")
        }
      })
    },

  })

  useEffect(() => {
    setFeatures(subscription.features || {})
  }, [subscription])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Subscription Plan</DialogTitle>
          <DialogDescription>Modify the subscription plan configuration</DialogDescription>
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
                      </Field>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Feature configuration preserved from original subscription. Full feature editor available in detailed
                  view.
                </p>
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
                        Is Visible
                      </label>
                    </div>
                  )}
                />
              </TabsContent>
            </Tabs>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting || isPending} className="w-full">
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Subscription...
                    </>
                  ) : (
                    "Update Subscription Plan"
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
