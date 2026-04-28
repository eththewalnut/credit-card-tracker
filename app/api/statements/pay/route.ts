import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
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
