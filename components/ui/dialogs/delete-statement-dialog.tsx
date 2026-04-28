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
import { deleteStatement } from "@/app/query/statements";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type StatementInfo = {
  id: string;
  statementDate: string;
  dueDate: string;
  billFrom: string;
  billTo: string;
  cardId: string;
  paymentStatus: "Paid" | "Not Paid" | "Sent To Me";
  paymentDate: string | null;
  amount: number;
  bankNameWithIdentifier?: string;
};
export default function DeleteDialog({
  statementInfo,
  onCloseDialog,
  isOpen,
}: {
  statementInfo: StatementInfo | undefined;
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

  return (
    <Dialog open={isOpen}>
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
            <p>{statementInfo?.statementDate}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Store:</h2>
            <p>{statementInfo?.billFrom}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Amount:</h2>
            <p>₱{statementInfo?.amount}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Bill To:</h2>
            <p>{statementInfo?.billTo}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Credit Card:</h2>
            <p>{statementInfo?.bankNameWithIdentifier}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Due Date:</h2>
            <p>{statementInfo?.dueDate}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Payment Status:</h2>
            <p>{statementInfo?.paymentStatus}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Payment Date:</h2>
            <p>
              {statementInfo?.paymentDate === null
                ? "Not Paid"
                : statementInfo?.paymentDate}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild onClick={onCloseDialog}>
            <Button disabled={isPending}>Nevermind</Button>
          </DialogClose>
          <DialogClose
            asChild
            onClick={() => {
              if (!statementInfo) {
                return null;
              }
              mutate(statementInfo.id);
            }}
          >
            <Button disabled={isPending}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
