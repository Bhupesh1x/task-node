"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function Client() {
  const { data: authData } = authClient.useSession();

  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "Bhupesh" }));

  return (
    <div>
      <h1>client: {JSON.stringify(data)}</h1>
      <h1>session: {JSON.stringify(authData)}</h1>
      <Button onClick={() => authClient.signOut()}>Logout</Button>
    </div>
  );
}
