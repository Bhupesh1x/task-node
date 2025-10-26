import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import { WorkflowsView } from "@/features/workflows/views/WorkflowsView";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";

async function page() {
  await requireAuth();

  prefetchWorkflows();

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
