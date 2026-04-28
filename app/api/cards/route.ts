import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized request." },
      { status: 401 },
    );
  }
  try {
    const cards = await prisma.cards.findMany({
      select: {
        id: true,
        bankNameWithIdentifier: true,
      },
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: cards, success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
}
