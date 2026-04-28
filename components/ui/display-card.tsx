"use client";
import { useState } from "react";
import DeleteCardDialog from "./dialogs/delete-card-dialog";
import Link from "next/link";
import { deleteCard } from "@/lib/actions/card-actions";
import { Card } from "./card";

type CardDisplayProps = {
  bankName: string;
  statementDate: string;
  dueDate: string;
  id: string;
  userId: string;
};
export default function CardDisplay({
  id,
  bankName,
  statementDate,
  dueDate,
  userId,
}: CardDisplayProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  function confirmDelete() {
    setDeleteDialogOpen(false);
    deleteCard(id, userId);
  }

  return (
    <>
      <DeleteCardDialog
        bankName={bankName}
        statementDate={statementDate}
        dueDate={dueDate}
        closeDialog={() => setDeleteDialogOpen(false)}
        isOpen={deleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
      <Card className="w-xs mt-4 mx-2 text-sm rounded-lg border border-gray-200 p-2">
        <div className="container mb-10">
          <div className="mb-2">
            <strong>{bankName}</strong>
          </div>
          <div>
            Statement billing date:{" "}
            <strong>{statementDate} of the month</strong>
          </div>
          <div>
            Statement due date: <strong>{dueDate} of the month</strong>
          </div>
        </div>
        <div className="flex justify-end gap-4 mx-2">
          <Link href={`cards/${id}/edit`}>
            <p className="underline hover:cursor-pointer hover:text-stone-400">
              Edit
            </p>
          </Link>
          <div>|</div>
          <p
            className="underline underline hover:cursor-pointer hover:text-stone-400"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </p>
        </div>
      </Card>
    </>
  );
}
