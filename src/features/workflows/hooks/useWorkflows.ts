import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useWorkflowParams } from "./useWorkflowParams";

export function useSuspenseWorkflows() {
  const trpc = useTRPC();

  const [params] = useWorkflowParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

export function useCreateWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data?.name}" created`);

        const [params] = useWorkflowParams();

        setTimeout(() => {
          queryClient.invalidateQueries(
            trpc.workflows.getMany.queryOptions(params)
          );
        }, 100);
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error?.message}`);
      },
    })
  );
}
