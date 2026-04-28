"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoaderOverlay from "@/components/ui/loader-overlay";
import StatementTableNew from "@/components/Tables/statement-table-refactored";
import { getStatements } from "@/app/query/statements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PayDialog from "@/components/ui/dialogs/set-payment-date-dialog";
import { markStatementsAsPaid } from "@/app/query/statements";
import { toast } from "sonner";

export type StatementUpdate = {
  statementId: string;
  statementDate: string;
  amount: number;
  billTo: string;
  cardId: string;
  dueDate: string;
  billFrom: string;
  bankNameWithIdentifier: string;
};

export default function StatementsPage() {
  const [paidStatements, setPaidStatements] = useState<StatementUpdate[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["statementData"],
    queryFn: getStatements,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: markStatementsAsPaid,
    onSuccess: () => {
      toast.success("Statements has been successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["statementData"] });
      setPaidStatements([]);
      setPaymentDialogOpen(false);
    },
    onError: () => {
      toast.error("Update failed! Please refresh your page and try again.");
    },
  });
  useEffect(() => {
    console.log(paidStatements);
  }, [paidStatements]);

  if (!data) {
    return <LoaderOverlay loading={isLoading} loadingText="Please wait..." />;
  }
  const handleSelectStatement = ({
    statementId,
    statementDate,
    amount,
    billTo,
    cardId,
    dueDate,
    billFrom,
    bankNameWithIdentifier,
  }: StatementUpdate) => {
    setPaidStatements((prev) => [
      ...prev,
      {
        statementId,
        statementDate,
        amount,
        billTo,
        cardId,
        dueDate,
        billFrom,
        bankNameWithIdentifier,
      },
    ]);
  };
  const handleDeselectStatement = (
    statementId: StatementUpdate["statementId"],
  ) => {
    setPaidStatements((prev) =>
      prev.filter((s) => s.statementId !== statementId),
    );
  };

  const handlePaymentConfirm = (paymentDate: Date) => {
    const statementIdsToBePaid = paidStatements.map(
      (statement) => statement.statementId,
    );

    mutate({ statementIds: statementIdsToBePaid, paymentDate });
  };

  return (
    <>
      <LoaderOverlay loading={isLoading} loadingText="Please wait..." />
      <PayDialog
        isOpen={paymentDialogOpen}
        paidStatements={paidStatements}
        onCloseDialog={() => setPaymentDialogOpen(false)}
        isUpdatePending={isPending}
        onConfirmUpdate={handlePaymentConfirm}
      />
      {data.length < 1 ? (
        <Card className="mx-auto mt-100 w-lg">
          <CardContent className="mx-auto">
            You have no Statements Yet!
          </CardContent>
          <CardFooter>
            <Button className="mx-auto">
              <Link href="/statements/add">Add your first Statement here.</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="mx-auto mt-10">
              <StatementTableNew
                isChecked={paidStatements.map(
                  (statement) => statement.statementId,
                )}
                data={data}
                onDeselect={handleDeselectStatement}
                onSelect={handleSelectStatement}
              />
            </div>
          </div>
          <div className="flex justify-center mx-auto">
            <Button className="mt-4 mx-3">
              <Link href="/statements/add">Add Statements</Link>
            </Button>
            {paidStatements.length > 0 && (
              <Button
                className="mt-4 mx-3"
                onClick={() => setPaymentDialogOpen(true)}
              >
                Set Payment Date
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
