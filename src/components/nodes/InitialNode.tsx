import { memo } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeProps } from "@xyflow/react";

import { WorkflowNode } from "./WorkflowNode";
import { PlaceholderNode } from "../placeholder-node";

function InitialNodeComponent(props: NodeProps) {
  return (
    <WorkflowNode>
      <PlaceholderNode {...props} onClick={() => {}}>
        <div className="flex items-center justify-center cursor-pointer">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
}

export const InitialNode = memo(InitialNodeComponent);

InitialNode.displayName = "InitialNode";
