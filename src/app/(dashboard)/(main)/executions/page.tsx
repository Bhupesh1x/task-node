import { requireAuth } from "@/lib/auth-utils";

async function page() {
  await requireAuth();

  return (
    <div>
      <h1>Executions Page</h1>
    </div>
  );
}

export default page;
