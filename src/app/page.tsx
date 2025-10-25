import { requireAuth } from "@/lib/auth-utils";

import { Client } from "./client";

async function Home() {
  await requireAuth();

  return (
    <div className="p-2">
      <Client />
    </div>
  );
}

export default Home;
