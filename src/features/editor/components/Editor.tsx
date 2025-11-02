"use client";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";

import { ErrorView, LoadingView } from "@/components/EntityComponents";

interface Props {
  workflowId: string;
}

export function Editor({ workflowId }: Props) {
  const workflow = useSuspenseWorkflow(workflowId);

  return (
    <div>
      <h1>{JSON.stringify(workflow, null, 2)}</h1>
    </div>
  );
}

export function EditorLoading() {
  return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
  return <ErrorView message="Error loading editor" />;
}
