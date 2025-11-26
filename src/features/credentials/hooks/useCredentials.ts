import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import type { CredentialType } from "@/generated/prisma";

import { useCredentialsParams } from "./useCredentialsParams";

export function useSuspenseCredentials() {
  const trpc = useTRPC();

  const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
}

export function useCreateCredential() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data?.name}" created`);

        setTimeout(() => {
          queryClient.invalidateQueries(
            trpc.credentials.getMany.queryOptions({})
          );
        }, 100);
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error?.message}`);
      },
    })
  );
}

export function useRemoveCredential() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" deleted`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: () => {
        toast.error(
          `Failed to delete credential. Please try again after some time.`
        );
      },
    })
  );
}

export function useSuspenseCredential(id: string) {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
}

export function useUpdateCredential() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: () => {
        toast.error(
          `Failed to save the credential. Please try again after sometime`
        );
      },
    })
  );
}

export function useCredentialByType(type: CredentialType) {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
}
