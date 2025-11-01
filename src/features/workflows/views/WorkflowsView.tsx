"use client";

import { useRouter } from "next/navigation";

import { useEntitySearch } from "@/hooks/use-entity-search";

import { useUpgradeModal } from "@/features/subscriptions/hooks/useUpgradeModal";

import {
  EntityHeader,
  EntitySearch,
  EntityContainer,
} from "@/components/EntityComponents";

import { useWorkflowParams } from "../hooks/useWorkflowParams";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/useWorkflows";

export function WorkflowsView() {
  const workflows = useSuspenseWorkflows();

  const [params, setParams] = useWorkflowParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntityContainer>
      <WorkflowsHeader />
      <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
      />
      <div>{JSON.stringify(workflows, null, 2)}</div>
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
