"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardProvider({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <SidebarProvider defaultOpen={open}>{children}</SidebarProvider>
    </QueryClientProvider>
  );
}
