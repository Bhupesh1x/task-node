import { useQueryStates } from "nuqs";

import { credentialsParams } from "../params";

export function useCredentialsParams() {
  const params = useQueryStates(credentialsParams);

  return params;
}
