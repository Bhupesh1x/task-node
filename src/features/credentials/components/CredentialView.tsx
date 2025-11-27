"use client";

import { CredentialForm } from "./CredentialForm";
import { useSuspenseCredential } from "../hooks/useCredentials";

interface Props {
  credentialId: string;
}

export function CredentialView({ credentialId }: Props) {
  const { data: credential } = useSuspenseCredential(credentialId);

  return (
    <div className="p-4 md:py-6 md:px-10 h-full w-full">
      <div className="mx-auto max-w-3xl w-full h-full">
        <CredentialForm initialData={credential} />
      </div>
    </div>
  );
}
