import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{ workflowId: string }>;
}

async function page({ params }: Props) {
  await requireAuth();

  const { workflowId } = await params;

  return (
    <div>
      <h1>Workflow Id: {workflowId}</h1>
    </div>
  );
}

export default page;
