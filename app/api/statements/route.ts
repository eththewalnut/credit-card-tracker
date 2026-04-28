import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 },
    );
  }
  try {
    const statements = await prisma.statement.findMany({
      select: {
        id: true,
        statementDate: true,
        billFrom: true,
        billTo: true,
        amount: true,
        cardId: true,
        paymentStatus: true,
        paymentDate: true,
        dueDate: true,
        card: {
          select: {
            bankNameWithIdentifier: true,
          },
        },
      },
      where: {
        userId: session.user.id,
      },
    });

    const formattedStatements = statements.map((statement) => {
      let formattedPaymentStatus: "Paid" | "Not Paid" | "Sent To Me";
      switch (statement.paymentStatus) {
        case "PAID":
          formattedPaymentStatus = "Paid";
          break;
        case "UNPAID":
          formattedPaymentStatus = "Not Paid";
          break;
        case "SENT":
          formattedPaymentStatus = "Sent To Me";
          break;
        default:
          formattedPaymentStatus = "Not Paid"; // Default case
      }

      const statementDateInLocal = new Date(
        statement.statementDate,
      ).toLocaleDateString();
      const dueDateInLocal = new Date(statement.dueDate).toLocaleDateString();
      const paymentDateInLocal = statement.paymentDate
        ? new Date(statement.paymentDate).toLocaleDateString()
        : null;
      const formattedStatement = {
        ...statement,
        statementDate: statementDateInLocal,
        dueDate: dueDateInLocal,
        paymentDate: paymentDateInLocal,
        paymentStatus: formattedPaymentStatus,
        bankNameWithIdentifier: statement.card.bankNameWithIdentifier,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { card, ...newStatementObject } = formattedStatement;
      return newStatementObject;
    });

    return NextResponse.json(formattedStatements);
  } catch (error) {
    console.error("Error fetching statements:", error);
    return NextResponse.json(
      { message: "Failed to fetch statements", error },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const submittedStatements = await req.json();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 },
    );
  }
  try {
    if (
      !Array.isArray(submittedStatements) ||
      submittedStatements.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 },
      );
    }

    const formattedStatementDates = submittedStatements.map((statement) => {
      let formattedPaymentStatus: "PAID" | "UNPAID" | "SENT";
      switch (statement.paymentStatus) {
        case "Paid":
          formattedPaymentStatus = "PAID";
          break;
        case "Not Paid":
          formattedPaymentStatus = "UNPAID";
          break;
        case "Sent To Me":
          formattedPaymentStatus = "SENT";
          break;
        default:
          formattedPaymentStatus = "UNPAID"; // Default case
      }
      return {
        ...statement,
        amount: parseFloat(statement.amount),
        statementDate: new Date(statement.statementDate),
        dueDate: new Date(statement.dueDate),
        paymentDate: statement.paymentDate
          ? new Date(statement.paymentDate)
          : null,
        paymentStatus: formattedPaymentStatus,
      };
    });

    const createdStatements = await prisma.statement.createMany({
      data: formattedStatementDates.map((statement) => ({
        statementDate: statement.statementDate,
        dueDate: statement.dueDate,
        amount: statement.amount,
        billTo: statement.billTo,
        cardId: statement.cardId,
        paymentStatus: statement.paymentStatus,
        paymentDate: statement.paymentDate,
        billFrom: statement.billFrom,
        userId: session.user.id,
      })),
    });

    return NextResponse.json(
      {
        message: "Statements created successfully",
        count: createdStatements.count,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing statements:", error);
    return NextResponse.json(
      { message: "Failed to process statements", error },
      { status: 500 },
    );
  }
}
