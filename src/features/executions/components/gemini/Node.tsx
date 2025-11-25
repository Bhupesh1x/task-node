import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

import { GeminiDialog } from "./Dialog";
import { fetchGeminiRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import type { formType, GeminiNodeData, GeminiNodeType } from "./types";

function GeminiNodeComponent(props: NodeProps<GeminiNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as GeminiNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `gemini-2.5-flash: ${nodeData?.userPrompt?.slice(0, 50)}...`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
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
      <GeminiDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon="/gemini.svg"
        name="Gemini"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const GeminiNode = memo(GeminiNodeComponent);

GeminiNode.displayName = "GeminiNode";
