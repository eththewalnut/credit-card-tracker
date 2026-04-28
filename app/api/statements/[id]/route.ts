import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
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
    const err = error as PrismaClientKnownRequestError;
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "No record found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
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
    const err = error as PrismaClientKnownRequestError;
    console.log(error instanceof PrismaClientKnownRequestError);
    if (err.code === "P2025") {
      return NextResponse.json(
        {
          error: {
            message: err.meta?.cause || "Tanginang eto talaga",
          },
        },
        { status: 404, statusText: "Record Not Found" },
      );
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
