import { Loader2Icon } from "lucide-react";
import { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loadingText?: string;
}

export default function LoadingButton({
  variant = "default",
  size = "default",
  loadingText,
}: Props) {
  return (
    <Button disabled variant={variant} size={size}>
      <Loader2Icon className="size-4 animate-spin" />
      {loadingText ? <span>{loadingText}</span> : null}
    </Button>
  );
}
