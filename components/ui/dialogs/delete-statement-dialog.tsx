import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "../button";
import { toast } from "sonner";
import { deleteStatement, getStatement } from "@/app/query/statements";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export default function DeleteDialog({
  statementId,
  onCloseDialog,
  isOpen,
}: {
  statementId: string;
  onCloseDialog: () => void;
  isOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteStatement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statementData"] });
      onCloseDialog();
      toast("Statement successfully deleted!");
    },
    onError: () => {
      toast(
        error?.message ||
          "Delete failed. Please refresh the page and try again.",
      );
    },
  });

  console.log(statementId);

  const { data, isLoading } = useQuery({
    queryKey: ["statement", statementId],
    queryFn: () => getStatement(statementId),
  });

  if (!data) {
    return (
      <Dialog open={isOpen}>
        <DialogContent onClose={onCloseDialog}>
          <DialogHeader>
            <DialogTitle>Fetching Data.</DialogTitle>
          </DialogHeader>
          <h1>Please wait..</h1>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen}>
      {isLoading ? (
        <h1>Please wait..</h1>
      ) : (
        <DialogContent onClose={onCloseDialog}>
          <DialogHeader>
            <DialogTitle>Delete this entry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-1">
              <h2 className="font-bold">Statement Date:</h2>
              <p>{data.statementDate}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Store:</h2>
              <p>{data.billFrom}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Amount:</h2>
              <p>₱{data.amount}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Bill To:</h2>
              <p>{data.billTo}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Credit Card:</h2>
              <p>{data.bankNameWithIdentifier}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Due Date:</h2>
              <p>{data.dueDate}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Payment Status:</h2>
              <p>{data.paymentStatus}</p>
            </div>
            <div className="grid gap-1">
              <h2 className="font-bold">Payment Date:</h2>
              <p>{data.paymentDate === null ? "Not Paid" : data.paymentDate}</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={onCloseDialog}>
              <Button disabled={isPending} variant={"secondary"}>
                Nevermind
              </Button>
            </DialogClose>
            <DialogClose
              asChild
              onClick={() => {
                if (!data) {
                  return null;
                }
                mutate(data.id);
              }}
            >
              <Button disabled={isPending}>Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
