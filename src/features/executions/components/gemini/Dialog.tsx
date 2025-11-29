import Image from "next/image";

import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { CredentialType } from "@/generated/prisma";

import { useCredentialByType } from "@/features/credentials/hooks/useCredentials";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { formSchema } from "./schema";
import type { formType, GeminiNodeData } from "./types";

interface Props {
  open: boolean;
  initialData?: GeminiNodeData;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: formType) => void;
}

export function GeminiDialog({
  open,
  initialData,
  onSubmit,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const params = useParams<{ workflowId: string }>();

  const { data: geminiCredentials, isLoading: isGeminiCredentialsLoading } =
    useCredentialByType(CredentialType.GEMINI);

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: initialData?.variableName || "",
      systemPrompt: initialData?.systemPrompt || "",
      userPrompt: initialData?.userPrompt || "",
      credentialId: initialData?.credentialId || "",
    },
  });

  const handleCredentialChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    if (value === "__add_new__") {
      router.push(
        `/credentials/new?redirectsTo=/workflows/${params?.workflowId}`
      );
      return;
    }

    onChange(value);
  };

  function handleSubmit(values: formType) {
    const isCredentialExist = geminiCredentials?.some(
      (credential) => credential.id === values?.credentialId
    );

    if (!isCredentialExist) {
      form.setValue("credentialId", "");

      form.setError("credentialId", {
        message: "Gemini credential is required",
        type: "required",
      });

      return;
    }

    onSubmit(values);
    onOpenChange(false);
  }

  const watchVariableName = form.watch("variableName") || "myGeminiData";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="mt-4 space-y-7"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="myGeminiData" />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini Credential</FormLabel>

                  <Select
                    disabled={isGeminiCredentialsLoading}
                    value={field.value}
                    onValueChange={(value) =>
                      handleCredentialChange(value, field.onChange)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {geminiCredentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/gemini.svg"
                              alt="Gemini"
                              height={16}
                              width={16}
                            />
                            <p>{credential?.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="__add_new__">
                        <div className="flex items-center gap-2">
                          <PlusIcon className="h-4 w-4" />
                          <p>Add credential</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="You are a helpful assistant."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      "Sets the behavior of the assistant. Use {{variables}} for simple values or {{json.variable}} to stringify objects"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Summarize this text: {{json httpResponse.data}}`}
                      className="min-h-30 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      "The prompt to send to the AI. Use {{variables}} for simple values or {{json.variable}} to stringify objects"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full md:w-fit md:ml-auto">
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
