"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
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

const formSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SocialProviders = "github" | "google";

export function SignInForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSignInWithSocialProvider(provider: SocialProviders) {
    setIsLoading(true);

    await authClient.signIn.social(
      {
        provider,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(
            ctx?.error?.message ||
              "Failed to sign in. Please try again after sometime"
          );
          setIsLoading(false);
        },
      }
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      {
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
              "Failed to sign in. Please try again after sometime"
          );
        },
      }
    );
  }

  const isPending = form.formState?.isSubmitting || isLoading;

  return (
    <Card className="w-md px-4">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Sign in to Task Node</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Button
            className="w-full text-[#0000009E] text-sm"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => onSignInWithSocialProvider("google")}
          >
            <Image src="/google.svg" alt="Google icon" height={16} width={16} />
            <span className="ml-1">Continue with Google</span>
          </Button>
          <Button
            className="w-full text-[#0000009E] text-sm"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => onSignInWithSocialProvider("github")}
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

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Logging you in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="h-px bg-[#00000012] w-full" />

          <div className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="underline underline-offset-2 hover:text-muted-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
