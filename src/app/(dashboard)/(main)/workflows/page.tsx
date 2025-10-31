import { Suspense } from "react";
import { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import { WorkflowsView } from "@/features/workflows/views/WorkflowsView";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { workflowParamsLoader } from "@/features/workflows/server/params-loader";

interface Props {
  searchParams: Promise<SearchParams>;
}

async function page({ searchParams }: Props) {
  await requireAuth();

  const params = await workflowParamsLoader(searchParams);

  prefetchWorkflows(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Workflow Error!</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <WorkflowsView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
