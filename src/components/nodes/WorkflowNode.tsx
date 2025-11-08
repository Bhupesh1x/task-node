import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../ui/button";
import { SettingsIcon, Trash2Icon } from "lucide-react";

interface Props {
  name?: string;
  description?: string;
  showToolbar?: boolean;
  children: React.ReactNode;
  onDelete?: () => void;
  onSettings?: () => void;
}

export function WorkflowNode({
  name,
  description,
  showToolbar = true,
  children,
  onDelete,
  onSettings,
}: Props) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2Icon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {!!name && (
        <NodeToolbar
          isVisible
          position={Position.Bottom}
          className="text-center max-w-[200px]"
        >
          <p className="font-medium">{name}</p>
          {!!description && (
            <p
              className="text-muted-foreground text-sm truncate"
              title={description}
            >
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
}
