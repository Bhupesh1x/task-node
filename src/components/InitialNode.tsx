import { memo } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeProps } from "@xyflow/react";

import { PlaceholderNode } from "./placeholder-node";

function InitialNodeComponent(props: NodeProps) {
  return (
    <PlaceholderNode {...props}>
      <div className="flex items-center justify-center cursor-pointer">
        <PlusIcon className="size-4" />
      </div>
    </PlaceholderNode>
  );
}

export const InitialNode = memo(InitialNodeComponent);

InitialNode.displayName = "InitialNode";
