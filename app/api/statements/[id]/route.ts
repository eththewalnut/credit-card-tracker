import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized action",
      },
      { status: 401 },
    );
  }
  try {
    const deletedStatement = await prisma.statement.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { success: true },
      { statusText: `${deletedStatement.id} has been deleted` },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "No record found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized action",
      },
      { status: 401 },
    );
  }
  try {
    const statement = await req.json();

    let formattedPaymentStatus;
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

    const formattedStatement = {
      ...statement,
      statementDate: new Date(statement.statementDate),
      dueDate: new Date(statement.dueDate),
      paymentDate: statement.paymentDate ? new Date(statement.dueDate) : null,
      paymentStatus: formattedPaymentStatus,
    };

    await prisma.statement.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        ...formattedStatement,
      },
    });
    return NextResponse.json({
      success: true,
      statusText: {
        ...statement,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "No record found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized action",
      },
      { status: 401 },
    );
  }

  try {
    const statement = await prisma.statement.findFirst({
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
        id: id,
        userId: session.user.id,
      },
    });

    if (!statement) {
      throw new Error(
        "Fetching failed. Please refresh the page and try again.",
      );
    }

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

    const statementDateInLocale = new Date(
      statement.statementDate,
    ).toLocaleDateString();
    const dueDateInLocal = new Date(statement.dueDate).toLocaleDateString();
    const paymentDateInLocal = statement.paymentDate
      ? new Date(statement.paymentDate).toLocaleDateString()
      : null;

    const formattedStatement = {
      id: statement.id,
      statementDate: statementDateInLocale,
      billFrom: statement.billFrom,
      billTo: statement.billTo,
      bankNameWithIdentifier: statement.card.bankNameWithIdentifier,
      dueDate: dueDateInLocal,
      paymentDate: paymentDateInLocal,
      amount: statement.amount,
      paymentStatus: formattedPaymentStatus,
      cardId: statement.cardId,
    };
    return NextResponse.json(formattedStatement);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "No record found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
