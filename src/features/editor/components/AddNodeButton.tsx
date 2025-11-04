import { memo } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

function AddNodeButtonComponent() {
  return (
    <Button variant="outline" size="icon" onClick={() => {}}>
      <PlusIcon />
    </Button>
  );
}

export const AddNodeButton = memo(AddNodeButtonComponent);

AddNodeButton.displayName = "AddNodeButton";
