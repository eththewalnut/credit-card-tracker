import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized action" },
      { status: 401, statusText: "Unauthorized action" },
    );
  }
  try {
    const { statementIds, paymentDate } = await req.json();

    await prisma.statement.updateMany({
      where: {
        id: { in: statementIds },
        userId: session.user.id,
      },
      data: {
        paymentStatus: "PAID",
        paymentDate: paymentDate,
      },
    });

    return NextResponse.json({
      success: true,
      statusText: {
        message: "Statements updated successfully!",
      },
    });
  } catch (error) {
    const err = error as PrismaClientKnownRequestError;
    console.log(error instanceof PrismaClientKnownRequestError);
    if (err.code === "P2025") {
      return NextResponse.json(
        {
          error: {
            message: err.meta?.cause || "Something went wrong!",
          },
        },
        { status: 404, statusText: "Record Not Found" },
      );
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
