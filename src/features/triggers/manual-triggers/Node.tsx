import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { BaseTriggerNode } from "../BaseTriggerNode";

function ManualTriggerNodeComponent(props: NodeProps) {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointerIcon}
      name="When clicking 'Execute workflow'"
      onDoubleClick={() => {}}
      onSettings={() => {}}
    />
  );
}

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);

ManualTriggerNode.displayName = "ManualTriggerNode";
