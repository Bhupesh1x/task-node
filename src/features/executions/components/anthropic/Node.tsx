import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

import { AnthropicDialog } from "./Dialog";
import { fetchAnthropicRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import type { formType, AnthropicNodeData, AnthropicNodeType } from "./types";

function AnthropicNodeComponent(props: NodeProps<AnthropicNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as AnthropicNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `gpt-4: ${nodeData?.userPrompt?.slice(0, 50)}...`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: ANTHROPIC_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });

  function onOpen() {
    setOpenDialog(true);
  }

  function handleSubmit(values: formType) {
    setNodes((nodes) =>
      nodes?.map((node) => {
        if (node.id === props?.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  }

  return (
    <>
      <AnthropicDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon="/anthropic.svg"
        name="Anthropic"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const AnthropicNode = memo(AnthropicNodeComponent);

AnthropicNode.displayName = "AnthropicNode";
