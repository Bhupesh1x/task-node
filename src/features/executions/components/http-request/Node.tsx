import { memo } from "react";
import { GlobeIcon } from "lucide-react";
import type { Node, NodeProps } from "@xyflow/react";

import { BaseExecutionNode } from "../BaseExecutionNode";

interface HttpRequestNodeData {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

function HttpRequestNodeComponent(props: NodeProps<HttpRequestNodeType>) {
  const nodeData = props?.data as HttpRequestNodeData;

  const description = nodeData?.endpoint
    ? `${nodeData?.method || "GET"}: ${nodeData?.endpoint}`
    : "Not configured";

  return (
    <BaseExecutionNode
      {...props}
      icon={GlobeIcon}
      name="HTTP Request"
      description={description}
      onDoubleClick={() => {}}
      onSettings={() => {}}
    />
  );
}

export const HttpRequestNode = memo(HttpRequestNodeComponent);

HttpRequestNode.displayName = "HttpRequestNode";
