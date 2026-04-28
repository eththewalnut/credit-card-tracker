import { cookies, headers } from "next/headers";
import DashboardProvider from "./DashboardProvider";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?error=invalid_session");
  }

  const token = session.session.token;
  const name = session.user.name;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <DashboardProvider open={defaultOpen}>
      <AppSidebar sessionToken={token} userName={name} />
      <main className="min-w-full">{children}</main>
    </DashboardProvider>
  );
}
