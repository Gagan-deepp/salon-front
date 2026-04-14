"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createUser } from "@/lib/actions/user_action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getFranchises } from "@/lib/actions/franchise_action"
import { useSession } from "next-auth/react"
import { z } from "zod"

const DESIGNATIONS = [
  'Salon Manager',
  'Receptionist',
  'Senior Hairstylist',
  'Junior Hairstylist',
  'Senior Beautician',
  'Junior Beautician',
  'Nail Artist',
  'Housekeeping Staff',
  'Pedicurist',
  'Others'
]

const userSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "FRANCHISE_OWNER", "CASHIER", "PROVIDER"], {
    required_error: "Select a role",
  }),
  designation: z.string().min(1, "Select a designation"),
  franchiseId: z.string().optional(),
  commissionType: z.enum(["PERCENTAGE", "FIXED", "HYBRID"]).optional(),
  serviceRate: z.coerce.number().min(0, "Service rate must be at least 0").max(100, "Service rate cannot exceed 100").optional(),
  productRate: z.coerce.number().min(0, "Product rate must be at least 0").max(100, "Product rate cannot exceed 100").optional(),
  isActive: z.boolean().default(true),
}).superRefine((value, ctx) => {
  if (value.role !== "SUPER_ADMIN" && !value.franchiseId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["franchiseId"],
      message: "Select a franchise",
    })
  }

  if (value.role === "CASHIER") {
    if (value.serviceRate === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceRate"],
        message: "Enter a service rate",
      })
    }

    if (value.productRate === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productRate"],
        message: "Enter a product rate",
      })
    }
  }
})


async function fetchFranchises() {
  const result = await getFranchises({ limit: 100 })
  return result.success ? result.data.data : []
}

export function CreateUserDialog({ children, onUserCreated, isSuperAdmin = true }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [franchises, setFranchises] = useState([])
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedRole, setSelectedRole] = useState("FRANCHISE_OWNER")


  useEffect(() => {
    const loadFranchises = async () => {
      const franchiseList = await fetchFranchises()
      setFranchises(franchiseList)
    }
    if (open) {
      loadFranchises()
    }
  }, [open])

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "FRANCHISE_OWNER",
      designation: "Others",
      franchiseId: session?.franchiseId || "",
      commissionType: "PERCENTAGE",
      serviceRate: 10,
      productRate: 5,
      isActive: true,
    },
    defaultState: {
      canSubmit: true,
    },
    canSubmitWhenInvalid: true,
    validators: {
      onChange: userSchema,
      onSubmit: userSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const payload = {
          name: value.name,
          email: value.email,
          phone: value.phone,
          password: value.password,
          role: value.role,
          designation: value.designation,
          isActive: value.isActive,
          companyId: session?.companyId || null,
        }

        if (value.role !== "SUPER_ADMIN") {
          payload.franchiseId = value.franchiseId
        }

        if (value.role === "CASHIER") {
          payload.commissionStructure = {
            type: value.commissionType || "PERCENTAGE",
            defaultServiceRate: Number(value.serviceRate) || 10,
            defaultProductRate: Number(value.productRate) || 5,
          }
        }

        const result = await createUser(payload)

        if (result.success) {
          toast.success("User created successfully")
          form.reset()
          setSelectedRole("FRANCHISE_OWNER")
          setOpen(false)
          router.refresh()
          onUserCreated?.()
        } else {
          toast.error(result.error || "Failed to create user")
        }
      })
    },
  })

  useEffect(() => {
    if (session?.franchiseId && !form.getFieldValue("franchiseId")) {
      form.setFieldValue("franchiseId", session.franchiseId)
    }
  }, [session?.franchiseId, form, open])

  const showCommissionFields = selectedRole === "CASHIER"

  return (
    <Dialog open={open} onOpenChange={setOpen}  >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Full Name *</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="John Doe"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email *</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="john@example.com"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="phone"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone *</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="+91 9876543210"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password *</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="Min 6 characters"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="role"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Role *</FieldLabel>
                  <Select
                    disabled={isPending}
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value)
                      setSelectedRole(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {isSuperAdmin && <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>}
                      <SelectItem value="FRANCHISE_OWNER">Franchise Owner</SelectItem>
                      <SelectItem value="CASHIER">Cashier</SelectItem>
                      <SelectItem value="PROVIDER">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="designation"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Designation *</FieldLabel>
                  <Select
                    disabled={isPending}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="franchiseId"
              children={(field) => (
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor={field.name}>Franchise *</FieldLabel>
                  <Select
                    value={field.state.value}
                    disabled={isPending || session?.user?.role === "FRANCHISE_OWNER"}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select franchise" />
                    </SelectTrigger>
                    <SelectContent>
                      {franchises.map((franchise) => (
                        <SelectItem key={franchise._id} value={franchise._id}>
                          {franchise.name} ({franchise.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {session?.user?.role === "FRANCHISE_OWNER"
                      ? "Franchise owners are tied to their current franchise."
                      : "Pick the franchise this user belongs to."}
                  </FieldDescription>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>

          {showCommissionFields ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Commission Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field
                  name="commissionType"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Commission Type</FieldLabel>
                      <Select
                        disabled={isPending}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed Amount</SelectItem>
                          <SelectItem value="HYBRID">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="serviceRate"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Service Rate (%) *</FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        max="100"
                        disabled={isPending}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value === "" ? "" : Number(event.target.value))}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="productRate"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Product Rate (%) *</FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        max="100"
                        disabled={isPending}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value === "" ? "" : Number(event.target.value))}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Commission settings only apply to the Cashier role.
              </div>
          )}

          <form.Field
            name="isActive"
            children={(field) => (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">Active Status</FieldLabel>
                  <FieldDescription className="text-sm text-muted-foreground">User can access the system when active</FieldDescription>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  disabled={isPending}
                />
              </div>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
