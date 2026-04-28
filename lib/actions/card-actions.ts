"use server";

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCardDetails(formData: FormData, userId: string) {
  const bank = formData.get("bank") as string;
  const identifier = formData.get("identifier") as string;
  const statementDate = formData.get("billingDate") as string;
  const dueDate = formData.get("dueDate") as string;

  const newName = bank + (identifier ? ` - ${identifier}` : "");
  const result = await prisma.cards.create({
    data: {
      bankNameWithIdentifier: newName,
      dueDate: dueDate,
      statementMonth: statementDate,
      userId,
    },
  });

  if (!result) {
    throw new Error("Something went wrong!");
  }
  revalidatePath("/cards");
}

export async function deleteCard(id: string, userId: string) {
  try {
    const result = await prisma.cards.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!result) {
      return { success: false, message: "Delete failed" };
    }
    revalidatePath("/cards");
    return { success: true, message: "Card deleted!" };
  } catch (error) {
    const err = error as PrismaClientKnownRequestError;
    if (err.code === "P2025") {
      return { success: false, message: err.message };
    }
    console.error(error);
  }
}

export async function editCard(formData: FormData, userId: string) {
  try {
    const id = formData.get("id") as string;
    const bank = formData.get("bankName") as string;
    const identifier = formData.get("identifier") as string;
    const statementDate = formData.get("statementDate") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!id || !bank || !statementDate || !dueDate) {
      throw new Error(
        "Incomplete details. Please ensure that details are complete",
      );
    }

    const newName = bank + (identifier ? ` - ${identifier}` : "");

    await prisma.cards.update({
      where: {
        id: id,
        userId,
      },
      data: {
        bankNameWithIdentifier: newName,
        dueDate: dueDate,
        statementMonth: statementDate,
      },
    });
    return { success: true, message: "Card details successfully updated!" };
  } catch (error) {
    const err = error as PrismaClientKnownRequestError;
    return { success: false, message: err.message };
  }
}

export async function createQuickStatement(formData: FormData, userId: string) {
  const statementDate = formData.get("statementDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const billFrom = formData.get("billFrom") as string;
  const billTo = formData.get("billTo") as string;
  const cardId = formData.get("creditCard") as string;
  const amount = formData.get("amount");

  console.log(statementDate, dueDate, billFrom, billTo, cardId, amount);

  if (
    !statementDate ||
    !dueDate ||
    !billFrom ||
    !billTo ||
    !cardId ||
    !amount
  ) {
    return {
      success: false,
      message: "Please complete all fields",
    };
  } else if (typeof amount !== "string") {
    return {
      success: false,
      message: "Invalid input for amount. Please check.",
    };
  }

  const formattedAmount = Number(parseFloat(amount).toFixed(2));
  await prisma.statement.create({
    data: {
      statementDate: new Date(statementDate),
      dueDate: new Date(dueDate),
      billFrom,
      billTo,
      amount: formattedAmount,
      cardId,
      paymentStatus: "UNPAID",
      paymentDate: null,
      userId,
    },
  });
  revalidatePath("/");
  return {
    success: true,
    message: "Statement added!",
  };
}
