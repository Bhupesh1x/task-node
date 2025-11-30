import { parseAsInteger } from "nuqs/server";

import { PAGINATION } from "@/configs/constants";

export const executionsParams = {
  page: parseAsInteger.withDefault(PAGINATION.defaultPage).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger.withDefault(PAGINATION.defaultPageSize).withOptions({
    clearOnDefault: true,
  }),
};
