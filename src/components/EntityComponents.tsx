import Link from "next/link";

import { ChangeEvent } from "react";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  title: string;
  newBtnText: string;
  disabled?: boolean;
  description?: string;
  isCreating?: boolean;
} & (
  | { newBtnHref: string; onNew?: never }
  | { onNew?: never; newBtnHref?: never }
  | { onNew: () => void; newBtnHref?: never }
);

export function EntityHeader({
  title,
  description,
  newBtnText,
  disabled,
  isCreating,
  newBtnHref,
  onNew,
}: Props) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h4 className="text-lg md:text-xl font-semibold">{title}</h4>
        {!!description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {onNew && !newBtnHref && (
        <Button
          disabled={disabled || isCreating}
          variant="destructive"
          onClick={onNew}
        >
          {isCreating ? (
            <Loader2Icon className="animate-spin size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          {newBtnText}
        </Button>
      )}

      {!onNew && newBtnHref && (
        <Button disabled={disabled} variant="destructive" asChild>
          <Link href={newBtnHref}>
            <PlusIcon className="size-4" />
            {newBtnText}
          </Link>
        </Button>
      )}
    </header>
  );
}

type ContainerProps = {
  children: React.ReactNode;
};

export function EntityContainer({ children }: ContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full h-full space-y-8">
        {children}
      </div>
    </div>
  );
}

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EntitySearch({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value);
  }

  return (
    <div className="w-full flex justify-end">
      <div className="relative">
        <SearchIcon className="absolute size-3.5 left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-8 bg-background shadow-none border-border max-w-[200px]"
        />
      </div>
    </div>
  );
}
