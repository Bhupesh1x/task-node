"use client";

import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { PAGINATION } from "@/configs/constants";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow as WorkflowType } from "@/generated/prisma";

import { useUpgradeModal } from "@/features/subscriptions/hooks/useUpgradeModal";

import {
  EmptyView,
  ErrorView,
  EntityItem,
  EntityList,
  LoadingView,
  EntitySearch,
  EntityHeader,
  EntityContainer,
  EntityPagination,
} from "@/components/EntityComponents";

import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/useWorkflows";
import { useWorkflowParams } from "../hooks/useWorkflowParams";

export function WorkflowsView() {
  const workflows = useSuspenseWorkflows();

  const [params, setParams] = useWorkflowParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  function onPageChange(page: number) {
    if (page < 1 || page > workflows?.data?.totalPages) return;

    setParams({
      ...params,
      page,
    });
  }

  return (
    <EntityContainer>
      <WorkflowsHeader />
      <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
      />

      <EntityList
        getKey={({ id }) => id}
        items={workflows?.data?.items}
        renderItem={(workflow) => <WorkflowItem data={workflow} />}
        emptyView={<WorkflowsEmptyView params={params} setParams={setParams} />}
      />

      <EntityPagination
        page={workflows?.data?.page}
        disabled={workflows?.isFetching}
        totalPages={workflows?.data?.totalPages}
        onPageChange={onPageChange}
      />
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

export function WorkflowsLoading() {
  return <LoadingView message="Loading workflows..." />;
}

export function WorkflowsError() {
  return <ErrorView message="Error loading workflows" />;
}

interface WorkflowsEmptyProps<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
}

export function WorkflowsEmptyView<T extends { search: string; page: number }>({
  params,
  setParams,
}: WorkflowsEmptyProps<T>) {
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

  function clearFilters() {
    setParams({
      ...params,
      page: PAGINATION.defaultPage,
      search: "",
    });
  }

  return (
    <>
      {modal}
      <EmptyView
        message={
          params?.search
            ? "No workflows match your current filters. Clear the filters to view all workflows."
            : "You've not created any workflows yet. Get started by creating your first workflow"
        }
        onBtnClick={params?.search ? clearFilters : onNew}
        btnText={params?.search ? "Clear filters" : "Add workflow"}
        isLoading={createWorkflow?.isPending}
        btnVariant={params?.search ? "outline" : "default"}
      />
    </>
  );
}

export function WorkflowItem({ data }: { data: WorkflowType }) {
  const removeWorkflow = useRemoveWorkflow();

  function onRemove() {
    removeWorkflow.mutate({ id: data.id });
  }

  return (
    <EntityItem
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data?.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data?.createdAt, { addSuffix: true })}
        </>
      }
      href={`/workflows/${data.id}`}
      image={<WorkflowIcon className="text-muted-foreground" />}
      onRemove={onRemove}
      isRemoving={removeWorkflow?.isPending}
    />
  );
}
