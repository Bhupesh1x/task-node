import { requireAuth } from "@/lib/auth-utils";

async function page() {
  await requireAuth();

  return (
    <div>
      <h1>Workflows Page</h1>
    </div>
  );
}

export default page;
