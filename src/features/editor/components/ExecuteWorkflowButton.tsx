import { FlaskConicalIcon, Loader2Icon } from "lucide-react";

import { useExecuteWorkflow } from "@/features/workflows/hooks/useWorkflows";

import { Button } from "@/components/ui/button";

interface Props {
  workflowId: string;
}

export function ExecuteWorkflowButton({ workflowId }: Props) {
  const executeWorkflow = useExecuteWorkflow();

  function onExecute() {
    executeWorkflow.mutate({ id: workflowId });
  }

  return (
    <Button size="lg" disabled={executeWorkflow.isPending} onClick={onExecute}>
      {executeWorkflow.isPending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <FlaskConicalIcon className="size-4" />
      )}
      Execute workflow
    </Button>
  );
}
