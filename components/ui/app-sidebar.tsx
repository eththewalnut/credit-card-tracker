"use client";
import {
  ReceiptText,
  Home,
  CreditCard,
  ArrowLeftToLine,
  LogOutIcon,
  UserCircle2Icon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Statements",
    url: "/statements",
    icon: ReceiptText,
  },
  {
    title: "Cards",
    url: "/cards",
    icon: CreditCard,
  },
  {
    title: "Account",
    url: "/account",
    icon: UserCircle2Icon,
  },
];

export function AppSidebar({
  sessionToken,
  userName,
}: {
  sessionToken: string;
  userName: string;
}) {
  const { open, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.revokeSession({
      token: sessionToken,
    });

    router.push("/login");
  };

  return (
    <>
      {!open && <SidebarTrigger />}
      <Sidebar>
        <SidebarHeader>
          <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            className="cursor-pointer w-full justify-between"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <span className="text-md">Hello, {userName}</span>
            <ArrowLeftToLine className="size-4" />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem
                    className="group-data-[collapsible=icon]:invisible"
                    key={item.title}
                  >
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="scale-100 mr-1" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:invisible">
              <SidebarMenuButton
                className="hover:cursor-pointer"
                onClick={handleLogOut}
              >
                <LogOutIcon />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
