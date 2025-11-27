"use client";

import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { CredentialType } from "@/generated/prisma";

import { useUpgradeModal } from "@/features/subscriptions/hooks/useUpgradeModal";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
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
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";

import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/useCredentials";

interface Props {
  initialData?: {
    id: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().trim().min(1, "Value is required"),
});

type FormType = z.infer<typeof formSchema>;

const credentialsTypeOptions = [
  {
    label: "Gemini",
    value: CredentialType.GEMINI,
    logo: "/gemini.svg",
  },
  {
    label: "OpenAI",
    value: CredentialType.OPENAI,
    logo: "/openai.svg",
  },
  {
    label: "Anthropic",
    value: CredentialType.ANTHROPIC,
    logo: "/anthropic.svg",
  },
];

export function CredentialForm({ initialData }: Props) {
  const router = useRouter();

  const { modal, handleError } = useUpgradeModal();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  function onSubmit(values: FormType) {
    if (isEdit && initialData?.id) {
      updateCredential.mutate({
        id: initialData?.id,
        ...values,
      });
    } else {
      createCredential.mutate(
        {
          ...values,
        },
        {
          onSuccess: (data) => {
            router.push(`/credentials/${data.id}`);
          },
          onError: (error) => {
            handleError(error);
          },
        }
      );
    }
  }

  const isSubmitting =
    createCredential?.isPending || updateCredential?.isPending;

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Create Credential</CardTitle>
          <CardDescription>
            Add a new API key or credential to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        {...field}
                        placeholder="My API Key"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>

                    <Select
                      disabled={isSubmitting}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentialsTypeOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                height={18}
                                width={18}
                              />
                              <p>{option?.label}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="sk-..."
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  disabled={isSubmitting}
                  asChild
                  variant="outline"
                  type="button"
                >
                  <Link href="/credentials">Cancel</Link>
                </Button>
                {isSubmitting ? (
                  <LoadingButton
                    className={isEdit ? "w-[61.38px]" : "w-[73px]"}
                  />
                ) : (
                  <Button type="submit">{isEdit ? "Save" : "Create"}</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
