import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";

import type {
  formType,
  HttpRequestNodeData,
  HttpRequestNodeType,
} from "./types";
import { HttpRequestDialog } from "./Dialog";
import { BaseExecutionNode } from "../BaseExecutionNode";
import { useNodeStatus } from "../../hooks/useNodeStatus";
import { fetchHttpRequestRealtimeToken } from "./actions";

function HttpRequestNodeComponent(props: NodeProps<HttpRequestNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as HttpRequestNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.endpoint
    ? `${nodeData?.method || "GET"}: ${nodeData?.endpoint}`
    : "Not configured";

  const { status } = useNodeStatus({
    nodeId: props?.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
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
              endpoint: values.endpoint,
              method: values.method,
              body: values.body,
              variableName: values.variableName,
            },
          };
        }
        return node;
      })
    );
  }

  return (
    <>
      <HttpRequestDialog
        open={openDialog}
        initialData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setOpenDialog}
      />
      <BaseExecutionNode
        {...props}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onDoubleClick={onOpen}
        onSettings={onOpen}
        status={status}
      />
    </>
  );
}

export const HttpRequestNode = memo(HttpRequestNodeComponent);

HttpRequestNode.displayName = "HttpRequestNode";
