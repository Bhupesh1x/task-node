"use client";

import { memo } from "react";
import Image from "next/image";
import { Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

import { BaseHandle } from "@/components/base-handle";
import { WorkflowNode } from "@/components/nodes/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/base-node";

interface Props {
  id: string;
  name: string;
  description?: string;
  icon: LucideIcon | string;
  children?: React.ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

function BaseTriggerNodeComponent({
  id,
  name,
  children,
  icon: Icon,
  description,
  onSettings,
  onDoubleClick,
}: Props) {
  const { setNodes, setEdges } = useReactFlow();

  function handleDelete() {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes?.filter((node) => node.id !== id);

      return updatedNodes;
    });

    setEdges((prevEdges) => {
      const updatedEdges = prevEdges?.filter(
        (edge) => edge?.source !== id && edge?.target !== id
      );

      return updatedEdges;
    });
  }

  return (
    <WorkflowNode
      name={name}
      description={description}
      onDelete={handleDelete}
      onSettings={onSettings}
    >
      <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl">
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name || "Icon"} height={16} width={15} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
}

export const BaseTriggerNode = memo(BaseTriggerNodeComponent);

BaseTriggerNode.displayName = "BaseTriggerNode";
