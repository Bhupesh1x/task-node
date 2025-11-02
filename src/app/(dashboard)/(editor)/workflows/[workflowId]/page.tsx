import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";

import { requireAuth } from "@/lib/auth-utils";

import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/features/editor/components/Editor";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";

interface Props {
  params: Promise<{ workflowId: string }>;
}

async function page({ params }: Props) {
  await requireAuth();

  const { workflowId } = await params;

  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <Editor workflowId={workflowId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
