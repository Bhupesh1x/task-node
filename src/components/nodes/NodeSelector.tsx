import { GlobeIcon, MousePointerIcon } from "lucide-react";

import { NodeType } from "@/generated/prisma";
import { NodeTypeOptions } from "@/configs/types";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { NodeSelectorItem } from "./NodeSelectorItem";

const triggerNodes: NodeTypeOptions[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking the button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOptions[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make a HTTP request",
    icon: GlobeIcon,
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({ open, children, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>What triggers the workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2">
          {triggerNodes?.map((node) => (
            <NodeSelectorItem key={node.type} node={node} />
          ))}
          <Separator />

          {executionNodes?.map((node) => (
            <NodeSelectorItem key={node.type} node={node} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
