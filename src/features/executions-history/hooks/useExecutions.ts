import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useExecutionsParams } from "./useExecutionsParams";

export function useSuspenseExecutions() {
  const trpc = useTRPC();

  const [params] = useExecutionsParams();
  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
}

export function useSuspenseExecution(id: string) {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
}
