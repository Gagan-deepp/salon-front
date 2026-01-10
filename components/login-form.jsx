"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signinAction } from "@/lib/actions/user-auth"
// import { signIn } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Loader2 } from "lucide-react"
import { useActionState, useTransition } from "react"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { signIn } from "next-auth/react"


export function LoginForm({
  className,
  ...props
}) {
  const [isPending, startTransition] = useTransition()


  // const [state, formAction, isPending] = useActionState(signinAction, { error: "", status: "INITIAL" })


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







          {/* <form action={formAction} >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" autoComplete="email" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" autoComplete="current-password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <> <Loader2 className="animate-spin" /> </> : "Login"}
                </Button>
              </div>
            </div>
          </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
