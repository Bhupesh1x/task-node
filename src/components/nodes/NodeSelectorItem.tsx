import { NodeTypeOptions } from "@/configs/types";

interface Props {
  node: NodeTypeOptions;
}

export function NodeSelectorItem({ node }: Props) {
  return (
    <div
      className="flex items-center gap-x-4 py-5 px-4 border-l-2 border-transparent hover:border-l-primary cursor-pointer"
      key={node.type}
    >
      {typeof node.icon === "string" ? (
        <img
          src={node.icon}
          alt={node.label}
          className="size-5 object-contain rounded"
        />
      ) : (
        <node.icon className="size-5" />
      )}

      <div className="space-y-1">
        <h4 className="text-sm font-medium">{node.label}</h4>
        <p className="text-xs text-muted-foreground">{node.description}</p>
      </div>
    </div>
  );
}
