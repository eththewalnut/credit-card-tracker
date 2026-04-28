import AuthForm from "@/components/ui/auth-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-row min-h-screen justify-center items-center mx-auto w-1/4">
      <AuthForm />
    </div>
  );
}
