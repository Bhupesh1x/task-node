import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

import { SlackDialog } from "./Dialog";
import { fetchSlackRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import type { formType, SlackNodeData, SlackNodeType } from "./types";

function SlackNodeComponent(props: NodeProps<SlackNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as SlackNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.content
    ? `Send: ${nodeData?.content?.slice(0, 50)}...`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
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
      <SlackDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon="/slack.svg"
        name="Slack"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const SlackNode = memo(SlackNodeComponent);

SlackNode.displayName = "SlackNode";
