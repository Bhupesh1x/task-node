import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";

import { GOOGLE_FROM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

import { GoogleFormTriggerDialog } from "./Dialog";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

function GoogleFormNodeComponent(props: NodeProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: GOOGLE_FROM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  function onOpen() {
    setOpenDialog(true);
  }

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon="/googleform.svg"
        name="Google Form"
        description="Executes when form is submitted"
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
      <GoogleFormTriggerDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}

export const GoogleFormTriggerNode = memo(GoogleFormNodeComponent);

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
