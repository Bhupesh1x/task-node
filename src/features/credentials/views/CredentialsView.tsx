"use client";

import { KeyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { PAGINATION } from "@/configs/constants";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential as CredentialDataType } from "@/generated/prisma";

import {
  EmptyView,
  ErrorView,
  EntityItem,
  EntityList,
  LoadingView,
  EntitySearch,
  EntityHeader,
  EntityContainer,
  EntityPagination,
} from "@/components/EntityComponents";

import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/useCredentials";
import { useCredentialsParams } from "../hooks/useCredentialsParams";

export function CredentialsView() {
  const credentials = useSuspenseCredentials();

  const [params, setParams] = useCredentialsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  function onPageChange(page: number) {
    if (page < 1 || page > credentials?.data?.totalPages) return;

    setParams({
      ...params,
      page,
    });
  }

  return (
    <EntityContainer>
      <CredentialsHeader />
      <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials"
      />

      <EntityList
        getKey={({ id }) => id}
        items={credentials?.data?.items}
        renderItem={(credential) => <CredentialItem data={credential} />}
        emptyView={
          <CredentialsEmptyView params={params} setParams={setParams} />
        }
      />

      <EntityPagination
        page={credentials?.data?.page}
        disabled={credentials?.isFetching}
        totalPages={credentials?.data?.totalPages}
        onPageChange={onPageChange}
      />
    </EntityContainer>
  );
}

export function CredentialsHeader() {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newBtnText="New credentials"
      newBtnHref="/credentials/new"
    />
  );
}

export function CredentialsLoading() {
  return <LoadingView message="Loading credentials..." />;
}

export function CredentialsError() {
  return <ErrorView message="Error loading credentials" />;
}

interface CredentialsEmptyProps<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
}

export function CredentialsEmptyView<
  T extends { search: string; page: number }
>({ params, setParams }: CredentialsEmptyProps<T>) {
  const router = useRouter();

  function onNew() {
    router.push(`/credentials/new`);
  }

  function clearFilters() {
    setParams({
      ...params,
      page: PAGINATION.defaultPage,
      search: "",
    });
  }

  return (
    <EmptyView
      message={
        params?.search
          ? "No credentials match your current filters. Clear the filters to view all credentials."
          : "You've not created any credentials yet. Get started by creating your first credential"
      }
      onBtnClick={params?.search ? clearFilters : onNew}
      btnText={params?.search ? "Clear filters" : "Add credential"}
      btnVariant={params?.search ? "outline" : "default"}
    />
  );
}

export function CredentialItem({ data }: { data: CredentialDataType }) {
  const removeCredential = useRemoveCredential();

  function onRemove() {
    removeCredential.mutate({ id: data.id });
  }

  return (
    <EntityItem
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data?.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data?.createdAt, { addSuffix: true })}
        </>
      }
      href={`/credentials/${data.id}`}
      image={<KeyIcon className="text-muted-foreground" />}
      onRemove={onRemove}
      isRemoving={removeCredential?.isPending}
    />
  );
}
