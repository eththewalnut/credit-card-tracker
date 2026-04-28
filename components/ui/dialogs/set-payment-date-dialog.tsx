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
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { Calendar } from "../calendar";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

type PaidStatements = {
  statementId: string;
  statementDate: string;
  dueDate: string;
  billFrom: string;
  billTo: string;
  amount: number;
  bankNameWithIdentifier: string;
};
export default function PayDialog({
  paidStatements,
  onConfirmUpdate,
  onCloseDialog,
  isOpen,
  isUpdatePending,
}: {
  paidStatements: PaidStatements[];
  onCloseDialog: () => void;
  onConfirmUpdate: (paymentDate: Date) => void;
  isOpen: boolean;
  isUpdatePending: boolean;
}) {
  const [paymentDatePickerOpen, setPaymentDatePickerOpen] =
    useState<boolean>(false);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={onCloseDialog}>
        <DialogHeader>
          <DialogTitle>
            Please set payment date for these statements.
          </DialogTitle>
          <DialogDescription>
            Check statement details before proceeding.
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Statement Date</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bill To</TableHead>
              <TableHead>Credit Card</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidStatements.map((statement) => (
              <TableRow key={statement.statementId}>
                <TableCell>{statement.statementDate}</TableCell>
                <TableCell>{statement.billFrom}</TableCell>
                <TableCell>{statement.amount}</TableCell>
                <TableCell>{statement.billTo}</TableCell>
                <TableCell>{statement.bankNameWithIdentifier}</TableCell>
                <TableCell>{statement.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid gap-1">
          <h2 className="font-bold">Payment Date:</h2>
          <Popover
            open={paymentDatePickerOpen}
            onOpenChange={setPaymentDatePickerOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {paymentDate ? paymentDate.toLocaleDateString() : "Select Date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={paymentDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) {
                    return "No Date Selected";
                  }
                  setPaymentDate(date);
                  setPaymentDatePickerOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {!isUpdatePending && (
          <DialogFooter>
            <DialogClose asChild onClick={onCloseDialog}>
              <Button>Nevermind</Button>
            </DialogClose>
            <DialogClose
              asChild
              onClick={() => {
                if (!paymentDate) {
                  toast.error("Please select a payment date!");
                  return;
                }
                onConfirmUpdate(paymentDate);
              }}
            >
              <Button>Update</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
