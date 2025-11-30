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
import type { formType, SlackNodeData } from "./types";

interface Props {
  open: boolean;
  initialData?: SlackNodeData;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: formType) => void;
}

export function SlackDialog({
  open,
  initialData,
  onSubmit,
  onOpenChange,
}: Props) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: initialData?.variableName || "",
      content: initialData?.content || "",
      webhookUrl: initialData?.webhookUrl || "",
    },
  });

  function handleSubmit(values: formType) {
    onSubmit(values);
    onOpenChange(false);
  }

  const watchVariableName = form.watch("variableName") || "mySlack";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this node.
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
                    <Input {...field} placeholder="mySlackData" />
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
                      placeholder="https://hooks.slack.com/triggers/..."
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Slack:
                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>
                        From Workspace Sidebar ➜ More ➜ Tools ➜ Workflows ➜ New
                      </li>
                      <li>
                        Build Workflow ➜ Create an event ➜ From a webhook ➜ Set
                        Up Variable (Make sure to have the key as "content" And
                        Data Type as "TEXT") ➜ Continue
                      </li>
                      <li>
                        Now the workflow is created ➜ + Add steps ➜ Send a
                        message to channel
                      </li>
                      <li>
                        Select a channel ➜ Insert a variable "content" (In Add a
                        message option) ➜ Save ➜ Finish Up ➜ Enter the name for
                        step ➜ Publish
                      </li>
                      <li>
                        Go to channel ➜ Workflows tab (In Header) ➜ Starts with
                        a webhook (Edit icon) ➜ Web request URL
                      </li>
                    </ol>
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
