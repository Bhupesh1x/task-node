import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useCredentialsParams } from "./useCredentialsParams";

export function useSuspenseCredentials() {
  const trpc = useTRPC();

  const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
}
