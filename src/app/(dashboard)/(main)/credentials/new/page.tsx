import { CredentialForm } from "@/features/credentials/components/CredentialForm";

function CredentialNewPage() {
  return (
    <div className="p-4 md:py-6 md:px-10 h-full w-full">
      <div className="mx-auto max-w-3xl w-full h-full">
        <CredentialForm />
      </div>
    </div>
  );
}

export default CredentialNewPage;
