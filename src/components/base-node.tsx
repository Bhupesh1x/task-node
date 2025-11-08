import { forwardRef, type HTMLAttributes } from "react";
import { Loader2Icon, XCircleIcon, CheckCircle2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { NodeStatus } from "./nodes/node-status-indicator";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  status?: NodeStatus;
}

export const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ className, status = "initial", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-md border border-muted-foreground bg-card text-card-foreground hover:bg-accent",
        className
      )}
      tabIndex={0}
      {...props}
    >
      {props.children}
      {status === "loading" && (
        <Loader2Icon className="absolute size-2 -bottom-0.5 -right-0.5 text-blue-700 animate-spin stroke-3" />
      )}
      {status === "success" && (
        <CheckCircle2Icon className="absolute size-2 bottom-0.5 right-0.5 text-green-700 stroke-3" />
      )}
      {status === "error" && (
        <XCircleIcon className="absolute size-2 bottom-0.5 right-0.5 text-red-700 stroke-3" />
      )}
    </div>
  )
);
BaseNode.displayName = "BaseNode";

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const BaseNodeHeader = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    {...props}
    className={cn(
      "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
      // Remove or modify these classes if you modify the padding in the
      // `<BaseNode />` component.
      className
    )}
  />
));
BaseNodeHeader.displayName = "BaseNodeHeader";

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const BaseNodeHeaderTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="base-node-title"
    className={cn("user-select-none flex-1 font-semibold", className)}
    {...props}
  />
));
BaseNodeHeaderTitle.displayName = "BaseNodeHeaderTitle";

export const BaseNodeContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-content"
    className={cn("flex flex-col gap-y-2 p-3", className)}
    {...props}
  />
));
BaseNodeContent.displayName = "BaseNodeContent";

export const BaseNodeFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="base-node-footer"
    className={cn(
      "flex flex-col items-center gap-y-2 border-t px-3 pb-3 pt-2",
      className
    )}
    {...props}
  />
));
BaseNodeFooter.displayName = "BaseNodeFooter";
