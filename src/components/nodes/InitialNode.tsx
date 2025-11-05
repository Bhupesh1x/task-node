import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeProps } from "@xyflow/react";

import { WorkflowNode } from "./WorkflowNode";
import { NodeSelector } from "./NodeSelector";
import { PlaceholderNode } from "../placeholder-node";

function InitialNodeComponent(props: NodeProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  function onOpen() {
    setSelectorOpen(true);
  }

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode>
        <PlaceholderNode {...props} onClick={onOpen}>
          <div className="flex items-center justify-center cursor-pointer">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
}

export const InitialNode = memo(InitialNodeComponent);

InitialNode.displayName = "InitialNode";
