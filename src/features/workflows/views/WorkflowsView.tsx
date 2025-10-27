"use client";

import { EntityContainer, EntityHeader } from "@/components/EntityComponents";

import { useSuspenseWorkflows } from "../hooks/useWorkflows";

export function WorkflowsView() {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityContainer>
      <WorkflowsHeader />
      <h1>{JSON.stringify(workflows?.data, null, 2)}</h1>
    </EntityContainer>
  );
}

export function WorkflowsHeader({ isCreating }: { isCreating?: boolean }) {
  return (
    <EntityHeader
      title="Workflows"
      description="Create and manage your workflows"
      newBtnText="New workflow"
      disabled={false}
      isCreating={isCreating}
      onNew={() => {}}
    />
  );
}
