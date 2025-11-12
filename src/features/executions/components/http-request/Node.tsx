import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { useReactFlow, type NodeProps } from "@xyflow/react";

import type {
  formType,
  HttpRequestNodeData,
  HttpRequestNodeType,
} from "./types";
import { HttpRequestDialog } from "./Dialog";
import { BaseExecutionNode } from "../BaseExecutionNode";

function HttpRequestNodeComponent(props: NodeProps<HttpRequestNodeType>) {
  const [openDialog, setOpenDialog] = useState(false);

  const nodeData = props?.data as HttpRequestNodeData;

  const { setNodes } = useReactFlow();

  const description = nodeData?.endpoint
    ? `${nodeData?.method || "GET"}: ${nodeData?.endpoint}`
    : "Not configured";

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
      />
    </>
  );
}

export const HttpRequestNode = memo(HttpRequestNodeComponent);

HttpRequestNode.displayName = "HttpRequestNode";
