import { toast } from "sonner";
import { useCallback } from "react";
import { createId } from "@paralleldrive/cuid2";
import { type Node, useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";

import { NodeType } from "@/generated/prisma";
import type { NodeTypeOptions } from "@/configs/types";

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
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow on when a Google Form is submitted",
    icon: "/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe",
    description: "Runs the flow on when a Stripe Event is captured",
    icon: "/stripe.svg",
  },
];

const executionNodes: NodeTypeOptions[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make a HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google Gemini to generate text",
    icon: "/gemini.svg",
  },
  {
    type: NodeType.OPENAI,
    label: "Open AI",
    description: "Uses Open AI to generate text",
    icon: "/openai.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Uses Anthropic to generate text",
    icon: "/anthropic.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a message to Discord",
    icon: "/discord.svg",
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({ open, children, onOpenChange }: Props) {
  const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();

  const handleClick = useCallback((selectedNode: NodeTypeOptions) => {
    // Checking if trying to add the manual trigger when one already exists

    if (selectedNode.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes();

      const hasManualTrigger = nodes?.some(
        (node) => node.type === NodeType.MANUAL_TRIGGER
      );

      if (hasManualTrigger) {
        toast.error("Only one manual trigger is allowed per workflow");
        return;
      }
    }

    setNodes((nodes) => {
      const hasInitialNode = nodes?.some(
        (node) => node.type === NodeType.INITIAL
      );

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const flowPosition = screenToFlowPosition({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      });

      const newNode: Node = {
        id: createId(),
        type: selectedNode?.type,
        data: {},
        position: flowPosition,
      };

      if (hasInitialNode) {
        return [newNode];
      }

      return [...nodes, newNode];
    });

    onOpenChange(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers the workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2">
          {triggerNodes?.map((node) => (
            <NodeSelectorItem
              key={node.type}
              node={node}
              onClick={handleClick}
            />
          ))}
          <Separator />

          {executionNodes?.map((node) => (
            <NodeSelectorItem
              key={node.type}
              node={node}
              onClick={handleClick}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
