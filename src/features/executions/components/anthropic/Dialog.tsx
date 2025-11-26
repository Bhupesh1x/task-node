import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { formSchema } from "./schema";
import type { formType, AnthropicNodeData, AnthropicNodeType } from "./types";

interface Props {
  open: boolean;
  initialData?: AnthropicNodeData;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: formType) => void;
}

export function AnthropicDialog({
  open,
  initialData,
  onSubmit,
  onOpenChange,
}: Props) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: initialData?.variableName || "",
      systemPrompt: initialData?.systemPrompt || "",
      userPrompt: initialData?.userPrompt || "",
    },
  });

  function handleSubmit(values: formType) {
    onSubmit(values);
    onOpenChange(false);
  }

  const watchVariableName = form.watch("variableName") || "myAnthropicData";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Open AI Configuration</DialogTitle>
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
                    <Input {...field} placeholder="myAnthropicData" />
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
