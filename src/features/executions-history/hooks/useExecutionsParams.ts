import { useQueryStates } from "nuqs";

import { executionsParams } from "../params";

export function useExecutionsParams() {
  const params = useQueryStates(executionsParams);

  return params;
}
