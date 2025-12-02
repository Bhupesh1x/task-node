"use client";

import Link from "next/link";

import {
  PlusIcon,
  Trash2Icon,
  SearchIcon,
  Loader2Icon,
  PackageOpenIcon,
  MoreVerticalIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { ChangeEvent } from "react";
import type { VariantProps } from "class-variance-authority";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Button, type buttonVariants } from "./ui/button";

type Props = {
  title: string;
  newBtnText?: string;
  disabled?: boolean;
  description?: string;
  isCreating?: boolean;
  actionBtn?: React.ReactNode;
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
  actionBtn,
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

      {!!actionBtn ? actionBtn : null}

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
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-8 bg-background shadow-none border-border max-w-[200px]"
        />
      </div>
    </div>
  );
}

interface EntityPaginationProps {
  page: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function EntityPagination({
  page,
  totalPages,
  disabled,
  onPageChange,
}: EntityPaginationProps) {
  function onPrevious() {
    onPageChange(Math.max(page - 1, 1));
  }

  function onNext() {
    onPageChange(Math.min(page + 1, totalPages || 1));
  }

  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-muted-foreground flex-1">
        Page {page} of {totalPages || 1}
      </p>

      <div className="flex items-center gap-x-2">
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page === 1}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page === totalPages || totalPages === 0}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

interface StateView {
  message?: string;
}

export function LoadingView({ message }: StateView) {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center text-center space-y-3 flex-col">
      <Loader2Icon className="size-6 animate-spin text-primary" />

      <p className="text-sm text-muted-foreground">
        {message || "Loading items..."}
      </p>
    </div>
  );
}

export function ErrorView({ message }: StateView) {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center text-center space-y-3 flex-col">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && (
        <p className="text-sm text-muted-foreground">
          {message || "Error loading items"}
        </p>
      )}
    </div>
  );
}

interface EmptyViewProps extends StateView {
  btnText?: string;
  isLoading?: boolean;
  btnVariant?: VariantProps<typeof buttonVariants>["variant"];
  onBtnClick?: () => void;
}

export function EmptyView({
  message,
  btnText,
  isLoading,
  btnVariant,
  onBtnClick,
}: EmptyViewProps) {
  return (
    <div className="py-7 bg-background border-dashed flex items-center justify-center space-y-4 rounded-md flex-col text-center">
      <div className="bg-muted p-4 rounded-full">
        <PackageOpenIcon className="size-8" />
      </div>

      <h4 className="text-lg font-semibold">No items</h4>

      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}

      {!!onBtnClick && (
        <Button
          size="sm"
          onClick={onBtnClick}
          variant={btnVariant}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />{" "}
              <span>{btnText}</span>
            </>
          ) : (
            btnText
          )}
        </Button>
      )}
    </div>
  );
}

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  className = "",
  emptyView,
  getKey,
}: EntityListProps<T>) {
  if (items?.length === 0 && emptyView) {
    return (
      <div className="flex-1 items-center justify-center">
        <div className="max-w-xl mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-y-4 ${className}`}>
      {items?.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle: React.ReactNode;
  image: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export function EntityItem({
  href,
  title,
  image,
  subtitle,
  actions,
  isRemoving,
  onRemove,
}: EntityItemProps) {
  function handleRemove(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    onRemove?.();
  }

  return (
    <Link href={href} prefetch className={`${isRemoving ? "opacity-50" : ""}`}>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            {image}

            <div className="space-y-1">
              <h4 className="text-base font-medium">{title}</h4>
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {actions}

            {!!onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={isRemoving}
                    onClick={(e) => handleRemove(e)}
                  >
                    {isRemoving ? (
                      <Loader2Icon className="mr-2 animate-spin" />
                    ) : (
                      <Trash2Icon className="mr-2 text-destructive" />
                    )}
                    <span className="text-destructive">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
