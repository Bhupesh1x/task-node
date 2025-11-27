import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

import {
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/views/CredentialsView";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { CredentialView } from "@/features/credentials/components/CredentialView";

interface Props {
  params: Promise<{ credentialId: string }>;
}

async function page({ params }: Props) {
  await requireAuth();

  const { credentialId } = await params;

  prefetchCredential(credentialId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<CredentialsError />}>
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialView credentialId={credentialId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default page;
