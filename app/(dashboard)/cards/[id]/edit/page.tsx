import EditCardForm from "@/components/ui/edit-card-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function EditCardPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { id } = await params;

  if (!session) {
    redirect("/login?error=invalid_session");
  }
  const cardDetails = await prisma.cards.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    select: {
      bankNameWithIdentifier: true,
      dueDate: true,
      id: true,
      statementMonth: true,
    },
  });

  if (!cardDetails) {
    return (
      <div className="w-1/3 mx-auto mt-20">
        <h1>
          Card details not found. Ensure that the card selected is correct.
        </h1>
      </div>
    );
  }

  return (
    <div className="w-1/3 mx-auto mt-20">
      <EditCardForm cardDetails={cardDetails} userId={session.user.id} />
    </div>
  );
}
