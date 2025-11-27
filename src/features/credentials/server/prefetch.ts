import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type prefetchCredentialsInput = inferInput<typeof trpc.credentials.getMany>;

export function prefetchCredentials(params: prefetchCredentialsInput) {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
}

export function prefetchCredential(id: string) {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
}
