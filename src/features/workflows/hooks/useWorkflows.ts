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

        setTimeout(() => {
          queryClient.invalidateQueries(
            trpc.workflows.getMany.queryOptions({})
          );
        }, 100);
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error?.message}`);
      },
    })
  );
}

export function useRemoveWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" deleted`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: () => {
        toast.error(
          `Failed to delete workflow. Please try again after some time.`
        );
      },
    })
  );
}

export function useSuspenseWorkflow(id: string) {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

export function useUpdateWorkflowName() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: () => {
        toast.error(
          `Failed to update the workflow name. Please try again after sometime`
        );
      },
    })
  );
}

export function useUpdateWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: () => {
        toast.error(
          `Failed to save the workflow. Please try again after sometime`
        );
      },
    })
  );
}

export function useExecuteWorkflow() {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.executeWorkflow.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" executed`);
      },
      onError: () => {
        toast.error(
          `Failed to execute the workflow. Please try again after sometime`
        );
      },
    })
  );
}
