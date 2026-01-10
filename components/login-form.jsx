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
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >

        <form.Field
          name="email"
          children={(field) => (
            <Field>
              <Input
                id="email"
                placeholder="Username"
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => { field.handleChange(e.target.value) }}
                onBlur={field.handleBlur}
                className="h-14 rounded-full border-2 border-border/30 px-6 text-base placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground focus:border-primary/50 transition-colors"
              />
              {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )}
        />


        <form.Field
          name="password"
          children={(field) => (
            <Field>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => { field.handleChange(e.target.value) }}
                onBlur={field.handleBlur}
                className="h-14 rounded-full border-2 border-border/30 px-6 text-base placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground focus:border-primary/50 transition-colors"
              />
              {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )}
        />

        <div className="text-right">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-14 rounded-full bg-primary cursor-pointer hover:bg-foreground/90 text-background font-semibold text-base transition-all duration-300"
        >
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
    </div>
  );
}
