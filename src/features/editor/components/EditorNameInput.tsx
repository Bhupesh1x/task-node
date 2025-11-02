import type { FocusEvent } from "react";

import { useEffect, useRef, useState } from "react";

import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/useWorkflows";

import { Input } from "@/components/ui/input";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";

interface Props {
  workflowId: string;
}

export function EditorNameInput({ workflowId }: Props) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow?.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow?.name) {
      setName(workflow?.name);
    }
  }, [workflow?.name]);

  function onEdit() {
    setIsEditing(true);
  }

  async function onSave() {
    if (name === workflow?.name || !name?.trim()?.length) {
      setName(workflow?.name);
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflowName.mutateAsync({
        id: workflow?.id,
        name: name,
      });
    } catch {
      setName(workflow?.name || "");
    }

    setIsEditing(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      setName(workflow?.name || "");
      setIsEditing(false);
    }
  }

  function onBlur(e: FocusEvent<HTMLInputElement, Element>) {
    onSave();
  }

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="min-w-[220px] w-fit -ml-[9px]">
        <Input
          disabled={updateWorkflowName?.isPending}
          ref={inputRef}
          className="h-7 min-w-[220px] w-fit px-2"
          value={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </div>
    );
  }

  return (
    <BreadcrumbItem
      className="cursor-pointer hover:text-foreground"
      onClick={onEdit}
    >
      {workflow?.name || ""}
    </BreadcrumbItem>
  );
}
