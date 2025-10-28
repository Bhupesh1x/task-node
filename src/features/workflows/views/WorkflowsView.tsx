"use client";

import { useRouter } from "next/navigation";

import { useUpgradeModal } from "@/features/subscriptions/hooks/useUpgradeModal";

import { EntityContainer, EntityHeader } from "@/components/EntityComponents";

import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/useWorkflows";

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
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();

  const { modal, handleError } = useUpgradeModal();

  function onNew() {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data?.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  }

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        newBtnText="New workflow"
        isCreating={isCreating || createWorkflow?.isPending}
        onNew={onNew}
      />
    </>
  );
}
