import { parseAsString, parseAsInteger } from "nuqs/server";

import { PAGINATION } from "@/configs/constants";

export const credentialsParams = {
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  page: parseAsInteger.withDefault(PAGINATION.defaultPage).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger.withDefault(PAGINATION.defaultPageSize).withOptions({
    clearOnDefault: true,
  }),
};
