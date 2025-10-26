"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    email: z.email().min(1, "Email is required"),
    password: z.string().min(8, "Please enter a strong password"),
    confirmPassword: z.string(),
  })
  .refine((data) => data?.password === data?.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(
            ctx?.error?.message ||
              "Failed to sign up. Please try again after sometime"
          );
        },
      }
    );
  }

  const isPending = form.formState?.isSubmitting;

  return (
    <Card className="w-md px-4">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Create your account</CardTitle>
        <CardDescription>
          Welcome! Please fill in the details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Button
            className="w-full text-[#0000009E] text-sm"
            variant="outline"
            size="sm"
          >
            <Image src="/google.svg" alt="Google icon" height={16} width={16} />
            <span className="ml-1">Continue with Google</span>
          </Button>
          <Button
            className="w-full text-[#0000009E] text-sm"
            variant="outline"
            size="sm"
          >
            <Image src="/github.svg" alt="Github icon" height={16} width={16} />
            <span className="ml-1">Continue with Github</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-[#00000012] w-full" />
          <p className="text-[13px] text-[#0000009E]">or</p>
          <div className="h-px bg-[#00000012] w-full" />
        </div>

        {/* Email form */}

        <div className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="m@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Registering user..." : "Register"}
              </Button>
            </form>
          </Form>

          <div className="h-px bg-[#00000012] w-full" />

          <div className="text-center">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-2 hover:text-muted-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
