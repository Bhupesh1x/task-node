import { NodeType } from "@/generated/prisma";

export interface NodeTypeOptions {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
}
