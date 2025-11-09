"use client";

import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
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
import { useSetAtom } from "jotai";
import { useState, useCallback, useMemo } from "react";

import { NodeType } from "@/generated/prisma";
import { nodeComponents } from "@/configs/node-components";

import { editorAtom } from "@/features/workflows/store/atoms";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";

import { ErrorView, LoadingView } from "@/components/EntityComponents";

import { AddNodeButton } from "./AddNodeButton";
import { ExecuteWorkflowButton } from "./ExecuteWorkflowButton";

import "@xyflow/react/dist/style.css";

interface Props {
  workflowId: string;
}

export function Editor({ workflowId }: Props) {
  const workflow = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

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

  const hasManualTrigger = useMemo(() => {
    return nodes?.find((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes?.length]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid={true}
        panOnScroll={true}
        panOnDrag={false}
        selectionOnDrag={true}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
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
