"use client";

import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import {
  Panel,
  addEdge,
  MiniMap,
  Controls,
  ReactFlow,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { useState, useCallback } from "react";

import { nodeComponents } from "@/configs/node-components";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";

import { ErrorView, LoadingView } from "@/components/EntityComponents";

import { AddNodeButton } from "./AddNodeButton";

import "@xyflow/react/dist/style.css";

interface Props {
  workflowId: string;
}

export function Editor({ workflowId }: Props) {
  const workflow = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(workflow.data?.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.data?.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes={nodeComponents}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function EditorLoading() {
  return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
  return <ErrorView message="Error loading editor" />;
}
