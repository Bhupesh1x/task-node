import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/nodes/NodeSelector";

function AddNodeButtonComponent() {
  const [selectorOpen, setSelectorOpen] = useState(false);

  function onOpen() {
    setSelectorOpen(true);
  }

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button variant="outline" size="icon" onClick={onOpen}>
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
}

export const AddNodeButton = memo(AddNodeButtonComponent);

AddNodeButton.displayName = "AddNodeButton";
