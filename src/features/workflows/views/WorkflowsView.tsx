"use client";

import { useSuspenseWorkflows } from "../hooks/useWorkflows";

export function WorkflowsView() {
  const workflows = useSuspenseWorkflows();

  return (
    <div>
      <h1>{JSON.stringify(workflows?.data, null, 2)}</h1>
    </div>
  );
}
