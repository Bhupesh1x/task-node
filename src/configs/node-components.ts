import { NodeTypes } from "@xyflow/react";

import { NodeType } from "@/generated/prisma";

import { InitialNode } from "@/components/InitialNode";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
