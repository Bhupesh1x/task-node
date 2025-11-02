"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { EditorBreadCrumb } from "./EditorBreadCrumb";

interface Props {
  workflowId: string;
}

export function EditorHeader({ workflowId }: Props) {
  return (
    <header className="h-14 bg-background border-b px-3 flex items-center justify-between shrink-0 gap-2 md:px-9 md:py-6">
      <div className="flex items-center gap-x-3">
        <SidebarTrigger />
        <EditorBreadCrumb workflowId={workflowId} />
      </div>
    </header>
  );
}
