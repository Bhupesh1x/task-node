import { useEffect, useState } from "react";

import { PAGINATION } from "@/configs/constants";

interface Props<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: Props<T>) {
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  useEffect(() => {
    if (localSearch === "" && params?.search !== "") {
      setParams({
        ...params,
        page: PAGINATION.defaultPage,
        search: "",
      });
      return;
    }

    const timeout = setTimeout(() => {
      if (localSearch !== params?.search) {
        setParams({
          ...params,
          page: PAGINATION.defaultPage,
          search: localSearch,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [localSearch, params?.search, debounceMs]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
