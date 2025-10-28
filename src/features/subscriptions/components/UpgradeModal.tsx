"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function onUpgrade() {
    setIsLoading(true);

    await authClient.checkout({
      slug: "pro",
    });

    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            You need an active subscription to perform this action. Upgrade to
            Pro to unlock all features
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {isLoading ? (
            <LoadingButton loadingText="Upgrade Now" />
          ) : (
            <Button onClick={onUpgrade} disabled={isLoading}>
              Upgrade Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
