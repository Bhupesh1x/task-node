import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

import { DiscordDialog } from "./Dialog";
import { fetchDiscordRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import type { formType, DiscordNodeData, DiscordNodeType } from "./types";

function DiscordNodeComponent(props: NodeProps<DiscordNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as DiscordNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.content
    ? `Send: ${nodeData?.content?.slice(0, 50)}...`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
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
      <DiscordDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon="/discord.svg"
        name="Discord"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const DiscordNode = memo(DiscordNodeComponent);

DiscordNode.displayName = "DiscordNode";
