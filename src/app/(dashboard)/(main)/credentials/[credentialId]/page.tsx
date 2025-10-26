import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{ credentialId: string }>;
}

async function page({ params }: Props) {
  await requireAuth();

  const { credentialId } = await params;

  return (
    <div>
      <h1>Credential Id: {credentialId}</h1>
    </div>
  );
}

export default page;
