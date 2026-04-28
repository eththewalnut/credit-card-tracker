"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Bell } from "lucide-react";
import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen min-w-screen text-white flex flex-col items-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          Track Your Cards. Stay Debt-Free.
        </h1>
        <p className="text-lg mb-8 text-black">
          A simple way to monitor your credit card statements, due dates, and
          payments—all in one place.
        </p>

        <Link href="/login">
          <Button className="text-lg px-8 py-6 rounded-2xl shadow-lg">
            Get Started
          </Button>
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
        <FeatureCard
          icon={<CreditCard size={28} />}
          title="Manage Cards"
          description="Add and organize all your credit cards in one clean dashboard."
        />
        <FeatureCard
          icon={<CheckCircle size={28} />}
          title="Track Payments"
          description="Mark statements as paid or unpaid with ease."
        />
        <FeatureCard
          icon={<Bell size={28} />}
          title="Never Miss Due Dates"
          description="Stay ahead with reminders for upcoming bills."
        />
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4 text-blue-400">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
