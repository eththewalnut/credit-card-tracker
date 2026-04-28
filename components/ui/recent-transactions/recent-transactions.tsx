import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";
import { DataTable } from "./data-table";
import { columns, Statement } from "./columns";
import { prisma } from "@/lib/prisma";

async function getStatements(userId: string): Promise<Statement[]> {
  const statements = await prisma.statement.findMany({
    select: {
      id: true,
      amount: true,
      billFrom: true,
      billTo: true,
      card: {
        select: {
          bankNameWithIdentifier: true,
        },
      },
      dueDate: true,
      statementDate: true,
    },
    where: {
      paymentStatus: "UNPAID",
      userId,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(statements);
  const formattedStatements = statements.map((statement) => {
    const statementDateInLocal = new Date(
      statement.statementDate,
    ).toLocaleDateString();
    const dueDateInLocal = new Date(statement.dueDate).toLocaleDateString();
    const formattedStatement = {
      ...statement,
      statementDate: statementDateInLocal,
      dueDate: dueDateInLocal,
      bankNameWithIdentifier: statement.card.bankNameWithIdentifier,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { card, ...newStatementObj } = formattedStatement;
    return newStatementObj;
  });
  return formattedStatements;
}

export default async function RecentTransactions({
  userId,
}: {
  userId: string;
}) {
  const statements = await getStatements(userId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent statements</CardTitle>
        <CardDescription>
          An overview of your recently added unpaid statements.
        </CardDescription>
        <CardContent>
          <DataTable columns={columns} data={statements} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
