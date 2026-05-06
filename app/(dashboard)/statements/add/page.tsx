"use client";
import { useState } from "react";
import { createStatements } from "@/app/query/statements";
import StatementForm from "@/components/ui/statement-form";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LoaderOverlay from "@/components/ui/loader-overlay";
import { getCards } from "@/app/query/cards";
import Link from "next/link";

type SubmittedStatement = {
  statementDate: Date | undefined;
  billFrom: string;
  amount: number;
  billTo: string;
  cardId: string;
  dueDate: Date | undefined;
  paymentStatus: "Paid" | "Not Paid" | "Sent To Me";
};

export default function AddStatementsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statements, setStatements] = useState<SubmittedStatement[]>([
    {
      statementDate: undefined,
      billFrom: "",
      amount: 0,
      billTo: "",
      cardId: "",
      dueDate: undefined,
      paymentStatus: "Not Paid",
    },
  ]);
  const [invalidCards, setInvalidCards] = useState<number[]>([]);

  function handleAddStatement() {
    setStatements((prev) => [
      ...prev,
      {
        statementDate: undefined,
        billFrom: "",
        amount: 0,
        billTo: "",
        cardId: "",
        dueDate: undefined,
        paymentStatus: "Not Paid",
      },
    ]);
  }

  const { data } = useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createStatements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statementData"] });
      toast("Statements successfully saved!");
      router.push("/statements");
    },
    onError: () => {
      toast(
        "Something went wrong! Please check if you missed any details then try again",
      );
    },
  });

  function handleDeleteStatement(arrIndex: number) {
    setStatements((prev) => prev.filter((_, i) => i !== arrIndex));
  }

  function handleUpdateStatement(
    index: number,
    updatedStatement: SubmittedStatement,
  ) {
    setStatements((prev) =>
      prev.map((s, i) => (i === index ? updatedStatement : s)),
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const invalidIndexes: number[] = [];

    statements.map((statement, index) => {
      if (
        !statement.statementDate ||
        !statement.billFrom ||
        statement.amount < 1 ||
        !statement.billTo ||
        !statement.cardId ||
        !statement.dueDate ||
        !statement.paymentStatus
      ) {
        invalidIndexes.push(index);
      }
    });

    if (invalidIndexes.length > 0) {
      setInvalidCards(invalidIndexes);
      toast(
        "Invalid or incomplete input. Please ensure that forms are completed.",
      );
    } else {
      setInvalidCards([]);
      mutate(statements);
    }
  }

  function handleUpdateForm(cardIndex: number) {
    const updatedArray = invalidCards.filter(
      (invalidIndex) => cardIndex !== invalidIndex,
    );
    setInvalidCards(updatedArray);
  }

  const cardClassName = "p-10 w-5xl mx-auto mt-10 ";
  const errorCss = "animate-shake border-red-500";

  if (!data || data.length < 1) {
    return (
      <div className="grid grid-col gap-3 mt-10 place-items-center">
        <h1>
          No credit card available. Please add your credit card first before
          adding a statement.
        </h1>
        <Link href="/cards" className="underline">
          Go To Cards Page
        </Link>
      </div>
    );
  }

  return (
    <>
      <LoaderOverlay
        loading={isPending}
        loadingText="Submitting statements..."
      />
      <form className="mb-10" onSubmit={handleSubmit}>
        {statements.map((statement: SubmittedStatement, index: number) => {
          return (
            <Card
              onChange={() => {
                handleUpdateForm(index);
              }}
              className={
                invalidCards.includes(index)
                  ? cardClassName + errorCss
                  : cardClassName
              }
              key={index}
            >
              <CardHeader>
                <CardTitle>Add Statement</CardTitle>
                <CardAction>
                  {statements.length > 1 && (
                    <Button
                      variant={"ghost"}
                      className="hover:cursor-pointer"
                      onClick={() => handleDeleteStatement(index)}
                    >
                      <X />
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
              <CardContent>
                <StatementForm
                  cardOptions={data}
                  statementIndex={index}
                  data={statement}
                  onUpdate={handleUpdateStatement}
                />
              </CardContent>
            </Card>
          );
        })}
        <div className="flex justify-center mt-10">
          <Button className="mx-1" onClick={handleAddStatement}>
            Add more statements
          </Button>
          <Button className="mx-1" type="submit">
            Save Statements
          </Button>
          <Link href="/statements">
            <Button className="mx-1" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}
