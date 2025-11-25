import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

import { OpenAiDialog } from "./Dialog";
import { fetchOpenAiRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import type { formType, OpenAiNodeData, OpenAiNodeType } from "./types";

function OpenAiNodeComponent(props: NodeProps<OpenAiNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as OpenAiNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `gpt-4: ${nodeData?.userPrompt?.slice(0, 50)}...`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
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
      <OpenAiDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon="/openai.svg"
        name="Open AI"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const OpenAiNode = memo(OpenAiNodeComponent);

OpenAiNode.displayName = "OpenAiNode";
