import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import {
  CredentialsError,
  CredentialsLoading,
  CredentialsView,
} from "@/features/credentials/views/CredentialsView";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";

interface Props {
  searchParams: Promise<SearchParams>;
}

async function page({ searchParams }: Props) {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);

  prefetchCredentials(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<CredentialsError />}>
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialsView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
