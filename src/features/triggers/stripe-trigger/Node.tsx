import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";

import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

import { StripeTriggerDialog } from "./Dialog";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { fetchStripeTriggerRealtimeToken } from "./actions";

function StripeTriggerNodeComponent(props: NodeProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  function onOpen() {
    setOpenDialog(true);
  }

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon="/stripe.svg"
        name="Stripe"
        description="Executes when stripe event is captured"
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
      <StripeTriggerDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}

export const StripeTriggerNode = memo(StripeTriggerNodeComponent);

StripeTriggerNode.displayName = "StripeTriggerNode";
