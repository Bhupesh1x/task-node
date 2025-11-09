import { FlaskConicalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  workflowId: string;
}

export function ExecuteWorkflowButton({ workflowId }: Props) {
  return (
    <Button size="lg" disabled={false} onClick={() => {}}>
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
}
