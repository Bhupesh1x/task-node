"use client";

import {
  KeyIcon,
  StarIcon,
  LogOutIcon,
  Loader2Icon,
  HistoryIcon,
  CreditCardIcon,
  FolderOpenIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { useHasActiveSubscription } from "@/features/subscriptions/hooks/useSubscriptions";

import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    id: "main",
    name: "Main",
    items: [
      {
        title: "Workflows",
        url: "/workflows",
        icon: FolderOpenIcon,
      },
      {
        title: "Credentials",
        url: "/credentials",
        icon: KeyIcon,
      },
      {
        title: "Executions",
        url: "/executions",
        icon: HistoryIcon,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<
    "billing" | "upgrade" | "signout" | null
  >(null);

  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  function onSignout() {
    setLoading("signout");
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/sign-in");
        },
      },
    });
  }

  async function onUpgradeToPro() {
    setLoading("upgrade");
    await authClient.checkout({
      slug: "pro",
    });

    setLoading(null);
  }

  async function onBilling() {
    setLoading("billing");
    await authClient.customer.portal({
      fetchOptions: {
        onSuccess: () => {
          setLoading(null);
        },
      },
    });
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 px-4 gap-x-4"
              tooltip="Home"
            >
              <Link href="/workflows">
                <Image
                  src="/logo.svg"
                  height={20}
                  width={20}
                  alt="logo"
                  className=""
                />
                <span className="font-semibold text-sm">Task Node</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems?.map((group) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel>{group?.name}</SidebarGroupLabel>
            <SidebarGroupContent className="flex-1">
              <SidebarMenu>
                {group?.items?.map((item) => (
                  <SidebarMenuItem key={item.title} className="space-y-2">
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname?.startsWith(item?.url)
                      }
                      className="h-10 px-4 gap-x-4"
                      tooltip={item?.title || ""}
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item?.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-2">
            {!hasActiveSubscription && !isLoading ? (
              <SidebarMenuButton
                className="h-10 px-4 gap-x-4"
                tooltip="Upgrade to Pro"
                onClick={onUpgradeToPro}
                disabled={loading !== null}
              >
                {loading === "upgrade" ? (
                  <Loader2Icon className="animate-spin size-4" />
                ) : (
                  <StarIcon className="size-4" />
                )}
                <span className="font-semibold text-sm">
                  {loading === "upgrade"
                    ? "Upgrade to Pro..."
                    : "Upgrade to Pro"}
                </span>
              </SidebarMenuButton>
            ) : null}
            <SidebarMenuButton
              className="h-10 px-4 gap-x-4"
              tooltip="Billing Portal"
              onClick={onBilling}
              disabled={loading !== null}
            >
              {loading === "billing" ? (
                <Loader2Icon className="animate-spin size-4" />
              ) : (
                <CreditCardIcon className="size-4" />
              )}
              <span className="font-semibold text-sm">
                {loading === "billing" ? "Billing Portal..." : "Billing Portal"}
              </span>
            </SidebarMenuButton>
            <SidebarMenuButton
              className="h-10 px-4 gap-x-4"
              tooltip="Sign Out"
              onClick={onSignout}
              disabled={loading !== null}
            >
              {loading === "signout" ? (
                <Loader2Icon className="animate-spin size-4" />
              ) : (
                <LogOutIcon className="size-4" />
              )}
              <span className="font-semibold text-sm">
                {loading === "signout" ? "Signing Out..." : "Sign Out"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
