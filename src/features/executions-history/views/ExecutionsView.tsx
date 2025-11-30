"use client";

import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2Icon, XCircleIcon, CheckCircle2Icon } from "lucide-react";

import {
  ExecutionStatus,
  type Executions as ExecutionType,
} from "@/generated/prisma";

import {
  EmptyView,
  ErrorView,
  EntityItem,
  EntityList,
  LoadingView,
  EntityHeader,
  EntityContainer,
  EntityPagination,
} from "@/components/EntityComponents";

import { useSuspenseExecutions } from "../hooks/useExecutions";
import { useExecutionsParams } from "../hooks/useExecutionsParams";

export function ExecutionsView() {
  const executions = useSuspenseExecutions();

  const [params, setParams] = useExecutionsParams();

  function onPageChange(page: number) {
    if (page < 1 || page > executions?.data?.totalPages) return;

    setParams({
      ...params,
      page,
    });
  }

  return (
    <EntityContainer>
      <ExecutionsHeader />

      <EntityList
        getKey={({ id }) => id}
        items={executions?.data?.items}
        renderItem={(execution) => <ExecutionItem data={execution} />}
        emptyView={<ExecutionsEmptyView />}
      />

      <EntityPagination
        page={executions?.data?.page}
        disabled={executions?.isFetching}
        totalPages={executions?.data?.totalPages}
        onPageChange={onPageChange}
      />
    </EntityContainer>
  );
}

export function ExecutionsHeader() {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow executions history"
    />
  );
}

export function ExecutionsLoading() {
  return <LoadingView message="Loading executions..." />;
}

export function ExecutionsError() {
  return <ErrorView message="Error loading executions" />;
}

export function ExecutionsEmptyView() {
  return (
    <EmptyView message="You don't have any workflow executions yet. Get started by executing your first workflow" />
  );
}

const executionIconMap: Record<ExecutionStatus, React.ReactNode> = {
  [ExecutionStatus.RUNNING]: (
    <Loader2Icon className="size-5 text-blue-600 animate-spin" />
  ),
  [ExecutionStatus.SUCCESS]: (
    <CheckCircle2Icon className="size-5 text-green-600" />
  ),
  [ExecutionStatus.FAILED]: <XCircleIcon className="size-5 text-red-600" />,
};

export function ExecutionItem({
  data,
}: {
  data: ExecutionType & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) {
  const duration = useMemo(() => {
    return data?.completedAt
      ? Math.round(
          new Date(data?.completedAt).getTime() -
            new Date(data?.startedAt).getTime()
        ) / 1000
      : null;
  }, [data?.completedAt, data?.startedAt]);

  const StatusIcon = executionIconMap[data?.status];

  return (
    <EntityItem
      title={data.status}
      subtitle={
        <>
          {data?.workflow?.name} &bull; Started{" "}
          {formatDistanceToNow(data?.startedAt)}{" "}
          {data?.completedAt && duration ? (
            <span>&bull; Took {duration?.toFixed(2)}s</span>
          ) : null}
        </>
      }
      href={`/executions/${data.id}`}
      image={StatusIcon}
    />
  );
}
