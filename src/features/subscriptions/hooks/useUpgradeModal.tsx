import { useState } from "react";
import { TRPCClientError } from "@trpc/client";

import { UpgradeModal } from "../components/UpgradeModal";

export function useUpgradeModal() {
  const [open, setOpen] = useState(false);

  function handleError(error: unknown) {
    if (error instanceof TRPCClientError) {
      if (error?.data?.code === "FORBIDDEN") {
        setOpen(true);
      }
    }
  }

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { handleError, modal, setOpen };
}
