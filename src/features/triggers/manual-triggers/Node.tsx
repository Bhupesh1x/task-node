import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";

import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";

import { ManualTriggerDialog } from "./Dialog";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { fetchManualTriggerRealtimeToken } from "./actions";

function ManualTriggerNodeComponent(props: NodeProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  function onOpen() {
    setOpenDialog(true);
  }

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
      <ManualTriggerDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);

ManualTriggerNode.displayName = "ManualTriggerNode";
