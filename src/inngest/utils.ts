import toposort from "toposort";

import type { Connection, Node } from "@/generated/prisma";

export function topologicalSort(
  nodes: Node[],
  connections: Connection[]
): Node[] {
  // if no connection return the node as it is. As all of them are independent
  if (connections?.length === 0) {
    return nodes;
  }

  // Create edges array for toposort
  const edges: [string, string][] = connections?.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // Add node with no edges as self edges to make sure they're included
  // 1. First we will create a set so that we have all the unique node id which has connection by putting all conn in a set using loop.
  // 2. Then we loop over the node and check if the current node is not in the connection then it is a self edge because it is not creating a connection so we push that in the edges
  const connectedNodeIds = new Set<string>();

  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds?.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];

  try {
    sortedNodeIds = toposort(edges);

    // Remove duplicates (from self edges)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error?.message?.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }

    throw error;
  }

  // Map sorted IDs back to node objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return sortedNodeIds?.map((id) => nodeMap.get(id)!)?.filter(Boolean);
}
