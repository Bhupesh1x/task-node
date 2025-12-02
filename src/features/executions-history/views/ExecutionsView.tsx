"use client";

import {
  Loader2Icon,
  XCircleIcon,
  CheckCircle2Icon,
  RefreshCcwDotIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import {
  ExecutionStatus,
  type Executions as ExecutionType,
} from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";

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
import { Button } from "@/components/ui/button";

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

function RefetchButton() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);

  let timeout: ReturnType<typeof setTimeout> | null = null;
  function onRefetch() {
    setIsPending(true);
    queryClient.invalidateQueries(trpc.executions.getMany.queryOptions({}));

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setIsPending(false);
    }, 4 * 1000);
  }

  return (
    <Button variant="destructive" disabled={isPending} onClick={onRefetch}>
      {isPending ? (
        <RefreshCcwDotIcon className="size-4 animate-spin" />
      ) : (
        <RefreshCcwDotIcon className="size-4" />
      )}
      Refresh
    </Button>
  );
}

export function ExecutionsHeader() {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow executions history"
      actionBtn={<RefetchButton />}
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

  const formattedStatus = useMemo(() => {
    return (
      data?.status?.charAt(0) + data?.status?.slice(1)?.toLowerCase() ||
      data?.status ||
      ""
    );
  }, [data?.status]);

  return (
    <EntityItem
      title={formattedStatus}
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
