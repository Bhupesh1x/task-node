"use client";

import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export function Client() {
  const trpc = useTRPC();

  const { data: workflows } = useQuery(trpc.getMany.queryOptions());

  const create = useMutation(
    trpc.create.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued");
      },
    })
  );

  return (
    <div className="space-y-4 text-center">
      <div>{JSON.stringify(workflows, null, 2)}</div>
      <div>
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          Create
        </Button>
      </div>

      <Button onClick={() => authClient.signOut()}>Logout</Button>
    </div>
  );
}
