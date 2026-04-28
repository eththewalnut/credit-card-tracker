"use server";

import AccountsCard from "@/components/ui/profile-display-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?error=invalid-login");
  }

  return (
    <main className="flex flex-col">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl border-b-1 border-white-800 py-5 font-semibold">
          Account Settings
        </h1>
        <div className="mt-5">
          <AccountsCard user={session.user} />
        </div>
      </div>
    </main>
  );
}
