import { Suspense } from "react";

import { CredentialForm } from "@/features/credentials/components/CredentialForm";
import { CredentialsLoading } from "@/features/credentials/views/CredentialsView";

function CredentialNewPage() {
  return (
    <div className="p-4 md:py-6 md:px-10 h-full w-full">
      <div className="mx-auto max-w-3xl w-full h-full">
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialForm />
        </Suspense>
      </div>
    </div>
  );
}

export default CredentialNewPage;
