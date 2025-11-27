import { Loader2Icon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, type buttonVariants } from "@/components/ui/button";

interface Props {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loadingText?: string;
  className?: string;
}

export default function LoadingButton({
  variant = "default",
  size = "default",
  loadingText,
  className = "",
}: Props) {
  return (
    <Button
      disabled
      variant={variant}
      size={size}
      className={`text-center ${className}`}
    >
      <Loader2Icon className="size-4 animate-spin" />
      {loadingText ? <span>{loadingText}</span> : null}
    </Button>
  );
}
