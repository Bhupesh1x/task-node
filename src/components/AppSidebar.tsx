"use client";

import {
  KeyIcon,
  StarIcon,
  LogOutIcon,
  HistoryIcon,
  CreditCardIcon,
  FolderOpenIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

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
  const [isLoading, setIsLoading] = useState(false);

  function onSignout() {
    setIsLoading(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoading(false);
          redirect("/sign-in");
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
            <SidebarMenuButton
              className="h-10 px-4 gap-x-4"
              tooltip="Upgrade to pro"
              onClick={() => {}}
            >
              <StarIcon className="size-4" />
              <span className="font-semibold text-sm">Upgrade to pro</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              className="h-10 px-4 gap-x-4"
              tooltip="Billing Portal"
              onClick={() => {}}
            >
              <CreditCardIcon className="size-4" />
              <span className="font-semibold text-sm">Billing Portal</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              className="h-10 px-4 gap-x-4"
              tooltip="Sign Out"
              onClick={onSignout}
              disabled={isLoading}
            >
              <LogOutIcon className="size-4" />
              <span className="font-semibold text-sm">
                {isLoading ? "Signing Out..." : "Sign Out"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
