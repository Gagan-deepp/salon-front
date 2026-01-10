"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useTransition } from "react"
import { Field, FieldError, FieldLabel } from "./ui/field"


export function LoginForm({
  className,
  ...props
}) {
  const [isPending, startTransition] = useTransition()


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await signIn("credentials", { email: value.email, password: value.password })
      })
    },
  })


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >

            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(e) => { field.handleChange(e.target.value) }}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />


            <form.Field
              name="password"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="password">Password *</FieldLabel>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(e) => { field.handleChange(e.target.value) }}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />

            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
