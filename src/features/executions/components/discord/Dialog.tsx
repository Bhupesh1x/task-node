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
import type { formType, DiscordNodeData } from "./types";

interface Props {
  open: boolean;
  initialData?: DiscordNodeData;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: formType) => void;
}

export function DiscordDialog({
  open,
  initialData,
  onSubmit,
  onOpenChange,
}: Props) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: initialData?.variableName || "",
      username: initialData?.username || "",
      content: initialData?.content || "",
      webhookUrl: initialData?.webhookUrl || "",
    },
  });

  function handleSubmit(values: formType) {
    onSubmit(values);
    onOpenChange(false);
  }

  const watchVariableName = form.watch("variableName") || "myDiscord";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
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
                    <Input {...field} placeholder="myDiscordData" />
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
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Discord: Channel Settings ➜ Integrations ➜
                    Webhooks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Summary: {{myGemini.text}}`}
                      className="resize-none min-h-30"
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      "The message to send. Use {{variables}} for simple values or {{json.variable}} to stringify objects"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (Optional)</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="Workflow bot" />
                  </FormControl>
                  <FormDescription>
                    Override the webhook's default username
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
