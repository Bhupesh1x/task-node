import { Suspense } from "react";
import type { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import {
  ExecutionsView,
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions-history/views/ExecutionsView";
import { prefetchExecutions } from "@/features/executions-history/server/prefetch";
import { executionsParamsLoader } from "@/features/executions-history/server/params-loader";

interface Props {
  searchParams: Promise<SearchParams>;
}

async function page({ searchParams }: Props) {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);

  prefetchExecutions(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionsView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
