import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";

import { requireAuth } from "@/lib/auth-utils";

import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions-history/views/ExecutionsView";
import { prefetchExecution } from "@/features/executions-history/server/prefetch";
import { ExecutionView } from "@/features/executions-history/views/ExecutionView";

interface Props {
  params: Promise<{ executionId: string }>;
}

async function page({ params }: Props) {
  await requireAuth();

  const { executionId } = await params;
  prefetchExecution(executionId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionView executionId={executionId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
