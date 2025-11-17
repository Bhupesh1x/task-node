import { toast } from "sonner";
import { useState } from "react";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StripeTriggerDialog({ open, onOpenChange }: Props) {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const workflowId = params?.workflowId as string;

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe?workflowId=${workflowId}`;

  async function onCopyUrl() {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("URL copied successfully");
    } catch {
      toast.error("Failed to copy URL. Please try again after sometime");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard too trigger this
            workflow on payment events
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>

            <div className="flex items-center gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopyUrl}
                disabled={isLoading}
              >
                <CopyIcon />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted space-y-2 rounded-lg">
            <h4 className="font-medium">Setup Instructions:</h4>

            <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers ➜ Webhooks</li>
              <li>Click "Add Endpoint"</li>
              <li>Paste the webhook URL above</li>
              <li>
                Select the events to listen for (e.g. payment_intent.succeeded)
              </li>
              <li>Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="p-4 bg-muted space-y-2 rounded-lg">
            <h4 className="font-medium">Available Variables:</h4>

            <ul className="text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{stripe.amount}}"}
                </code>{" "}
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{stripe.currency}}"}
                </code>{" "}
                - Currency code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{stripe.customerId}}"}
                </code>{" "}
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{stripe.eventType}}"}
                </code>{" "}
                - Event type (e.g. payment_intent_succeeded)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{json stripe}}"}
                </code>{" "}
                - Full event data as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
