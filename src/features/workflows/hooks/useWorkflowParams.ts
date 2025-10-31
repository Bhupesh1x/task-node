import { useQueryStates } from "nuqs";

import { workflowParams } from "../params";

export function useWorkflowParams() {
  const params = useQueryStates(workflowParams);

  return params;
}
