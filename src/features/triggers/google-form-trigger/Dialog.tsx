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

import { generateGoogleFormScript } from "./google-form-script";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleFormTriggerDialog({ open, onOpenChange }: Props) {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const workflowId = params?.workflowId as string;

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/google-form?workflowId=${workflowId}`;

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

  async function onCopyScript() {
    setIsLoading(true);
    try {
      const script = generateGoogleFormScript(webhookUrl);
      await navigator.clipboard.writeText(script);
      toast.success("Script copied successfully");
    } catch {
      toast.error("Failed to copy script. Please try again after sometime");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full md:max-h-[98%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form's Apps Script to trigger
            this workflow when a form is submitted
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
              <li>Open your google form</li>
              <li>Click the three dots menu ➜ Script Editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace the WEBHOOK_URL with your webhook URL above</li>
              <li>Save and click "Triggers" ➜ Add Trigger</li>
              <li>Choose: From form ➜ On form submit ➜ Save</li>
            </ol>
          </div>

          <div className="p-4 bg-muted space-y-2 rounded-lg">
            <h4 className="font-medium">Google Apps Script:</h4>

            <Button
              type="button"
              variant="outline"
              onClick={onCopyScript}
              disabled={isLoading}
            >
              <CopyIcon className="mr-2" />
              Copy Google Apps Script
            </Button>

            <p className="text-sm text-muted-foreground">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>

          <div className="p-4 bg-muted space-y-2 rounded-lg">
            <h4 className="font-medium">Google Apps Script:</h4>

            <ul className="text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{googleForm.respondentEmail}}"}
                </code>{" "}
                - Respondent&quot;s email
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>{" "}
                - Specific answer
              </li>
              <li>
                <code className="bg-background px-1 py-0.5">
                  {"{{json googleForm.responses}}"}
                </code>{" "}
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
