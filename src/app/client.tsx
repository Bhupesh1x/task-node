"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function Client() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "Bhupesh" }));

  return (
    <div>
      <h1>client: {JSON.stringify(data)}</h1>
    </div>
  );
}
