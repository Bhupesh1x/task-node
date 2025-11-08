import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { ManualTriggerDialog } from "./Dialog";
import { BaseTriggerNode } from "../BaseTriggerNode";

function ManualTriggerNodeComponent(props: NodeProps) {
  const [openDialog, setOpenDialog] = useState(false);

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
      />
      <ManualTriggerDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);

ManualTriggerNode.displayName = "ManualTriggerNode";
