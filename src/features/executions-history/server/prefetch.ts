import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type prefetchExecutionsInput = inferInput<typeof trpc.executions.getMany>;

export function prefetchExecutions(params: prefetchExecutionsInput) {
  return prefetch(trpc.executions.getMany.queryOptions(params));
}

export function prefetchExecution(id: string) {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
}
