"use server";

import CardForm from "@/components/ui/submit-card-form";
import prisma from "@/lib/prisma";
import CardDisplay from "@/components/ui/display-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CardsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?error=invalid_session");
  }
  const cards = await prisma.cards.findMany({
    select: {
      bankNameWithIdentifier: true,
      dueDate: true,
      id: true,
      statementMonth: true,
    },
    where: {
      userId: session.user.id,
    },
  });
  console.log(cards);
  return (
    <main className="flex flex-col">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl border-b-1 border-white-800 py-5 font-semibold">
          Manage your credit cards
        </h1>
        <div className="flex flex-row">
          {cards.length < 1 ? (
            <p className="mt-10">
              No cards saved at the moment. Add your first card in the form
              below!
            </p>
          ) : (
            cards.map((card) => (
              <CardDisplay
                key={card.id}
                bankName={card.bankNameWithIdentifier}
                dueDate={card.dueDate}
                id={card.id}
                statementDate={card.statementMonth}
                userId={session.user.id}
              />
            ))
          )}
        </div>
      </div>
      <CardForm userId={session.user.id} />
    </main>
  );
}
