import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type prefetchWorkflowsInput = inferInput<typeof trpc.workflows.getMany>;

export function prefetchWorkflows(params: prefetchWorkflowsInput) {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
}
