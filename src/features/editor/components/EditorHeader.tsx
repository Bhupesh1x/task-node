"use client";

import { useAtomValue } from "jotai";
import { Loader2Icon, SaveIcon } from "lucide-react";

import { editorAtom } from "@/features/workflows/store/atoms";
import { useUpdateWorkflow } from "@/features/workflows/hooks/useWorkflows";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { EditorBreadCrumb } from "./EditorBreadCrumb";

interface Props {
  workflowId: string;
}

export function EditorHeader({ workflowId }: Props) {
  const editorState = useAtomValue(editorAtom);

  const saveWorkflow = useUpdateWorkflow();

  function onSave() {
    if (!workflowId) return;

    const nodes = editorState?.getNodes();
    const connections = editorState?.getEdges();

    saveWorkflow.mutate({
      id: workflowId,
      nodes: nodes || [],
      connections: connections || [],
    });
  }

  return (
    <header className="h-14 bg-background border-b px-3 flex items-center justify-between shrink-0 gap-2 md:px-9 md:py-6">
      <div className="flex items-center gap-x-3">
        <SidebarTrigger />
        <EditorBreadCrumb workflowId={workflowId} />
      </div>

      <Button onClick={onSave} disabled={saveWorkflow?.isPending}>
        {saveWorkflow?.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <SaveIcon className="size-4" />
        )}
        Save
      </Button>
    </header>
  );
}
