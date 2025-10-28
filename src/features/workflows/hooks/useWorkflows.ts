import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export function useSuspenseWorkflows() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}

export function useCreateWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data?.name}" created`);
        setTimeout(() => {
          queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
        }, 100);
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error?.message}`);
      },
    })
  );
}
