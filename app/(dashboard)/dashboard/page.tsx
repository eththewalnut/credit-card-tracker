import QuickStatementForm from "@/components/ui/quick-statement-form";
import RecentTransactions from "@/components/ui/recent-transactions/recent-transactions";
import SummaryCard from "@/components/ui/summary-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PasswordUpdatedToast } from "@/components/ui/toast/password-updated-toast";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?error=invalid_session");
  }

  const dueDateByGroup = await prisma.statement.groupBy({
    by: ["cardId", "dueDate"],
    _sum: {
      amount: true,
    },
    where: {
      paymentStatus: "UNPAID",
      userId: session.user.id,
    },
  });

  const summary = await Promise.all(
    dueDateByGroup.map(async (group) => {
      const cardInfo = await prisma.cards.findUnique({
        where: { id: group.cardId, userId: session.user.id },
        select: {
          bankNameWithIdentifier: true,
          dueDate: true,
          statementMonth: true,
        },
      });

      return {
        ...group,
        bankNameWithIdentifier: cardInfo?.bankNameWithIdentifier ?? "Unknown",
        statementMonth: cardInfo?.statementMonth ?? "",
        statementDue: cardInfo?.dueDate ?? "",
      };
    }),
  );

  console.log(summary.length);

  return (
    <div className="flex flex-col max-w-9/10 mx-auto mt-10">
      <PasswordUpdatedToast />
      <div>
        <h1 className="font-bold text-xl">Hello there, {session.user.name}!</h1>
        <h2>Here&apos;s an overview of your current statements:</h2>
      </div>
      <div className="grid grid-row grid-cols-3 gap-3 mt-5">
        {summary.length > 0 ? (
          summary.map((card, index) => (
            <SummaryCard
              key={`${card.cardId}_${index}`}
              bankName={card.bankNameWithIdentifier}
              statementDue={card.statementDue}
              statementDate={card.statementMonth}
              dueDate={card.dueDate}
              totalAmount={card._sum!.amount!}
            />
          ))
        ) : (
          <h1>You have no statements yet!</h1>
        )}
      </div>
      <div className="mt-10 grid gap-4 grid-cols-7">
        <div className="col-span-3">
          <QuickStatementForm userId={session.user.id} />
        </div>
        <div className="col-span-4">
          <RecentTransactions userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
