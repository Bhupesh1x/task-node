"use client";

import { memo } from "react";
import Image from "next/image";
import { Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

import { BaseHandle } from "@/components/base-handle";
import { WorkflowNode } from "@/components/nodes/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/base-node";

interface Props {
  name: string;
  description?: string;
  icon: LucideIcon | string;
  children?: React.ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

function BaseExecutionNodeComponent({
  name,
  children,
  icon: Icon,
  description,
  onSettings,
  onDoubleClick,
}: Props) {
  function handleDelete() {}
  return (
    <WorkflowNode
      name={name}
      description={description}
      onDelete={handleDelete}
      onSettings={onSettings}
    >
      <BaseNode onDoubleClick={onDoubleClick}>
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name || "Icon"} height={16} width={15} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="target-1" type="target" position={Position.Left} />
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
}

export const BaseExecutionNode = memo(BaseExecutionNodeComponent);

BaseExecutionNode.displayName = "BaseExecutionNode";
