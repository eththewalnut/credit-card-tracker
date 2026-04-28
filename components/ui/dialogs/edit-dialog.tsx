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
import { useEffect, useState } from "react";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "../select";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { Calendar } from "../calendar";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getCards } from "@/app/query/cards";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatement } from "@/app/query/statements";

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
};
export default function EditDialog({
  statementInfo,
  onCloseDialog,
  isOpen,
}: {
  statementInfo: StatementInfo;
  onCloseDialog: () => void;
  isOpen: boolean;
}) {
  const [updatedStatement, setUpdatedStatement] = useState<StatementInfo>({
    id: "",
    statementDate: "",
    dueDate: "",
    billFrom: "",
    billTo: "",
    cardId: "",
    paymentStatus: "Not Paid",
    paymentDate: null,
    amount: 0,
  });
  const { data } = useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
  });
  const [statementDatePickerOpen, setStatementDatePickerOpen] =
    useState<boolean>(false);

  const [dueDatePickerOpen, setDueDatePickerOpen] = useState<boolean>(false);

  const [paymentDatePickerOpen, setPaymentDatePickerOpen] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (statementInfo) {
      setUpdatedStatement(statementInfo);
    }
  }, [statementInfo]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateStatement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statementData"] });
      onCloseDialog();
      toast("Statement successfully updated!");
    },
    onError: () => {
      toast(
        error?.message ||
          "Update failed. Please refresh the page and try again.",
      );
    },
  });

  const handleEdit = (
    key: keyof StatementInfo,
    value: string | number | null,
  ) => {
    setUpdatedStatement((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        [key]: key === "amount" ? +value! : value,
      };
    });
  };

  if (!data) {
    return;
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={onCloseDialog}>
        <DialogHeader>
          <DialogTitle>Update this entry?</DialogTitle>
          <DialogDescription>Update your entry below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-2">
          <div className="grid gap-1">
            <h2 className="font-bold">Statement Date:</h2>
            <Popover
              open={statementDatePickerOpen}
              onOpenChange={setStatementDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {updatedStatement.statementDate === ""
                    ? "Select Date"
                    : updatedStatement.statementDate}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={new Date(updatedStatement.statementDate)}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (!date) return "No Date Selected";
                    const dateString = date.toLocaleDateString();
                    handleEdit("statementDate", dateString);
                    setStatementDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Store:</h2>
            <Input
              value={updatedStatement.billFrom}
              onChange={(e) => handleEdit("billFrom", e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Amount:</h2>
            <Input
              value={updatedStatement.amount}
              type="number"
              onChange={(e) => handleEdit("amount", e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Bill To:</h2>
            <Input
              value={updatedStatement.billTo}
              onChange={(e) => handleEdit("billTo", e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Select
              required
              value={updatedStatement.cardId}
              onValueChange={(value) => {
                handleEdit("cardId", value);
              }}
            >
              <h2 className="font-bold">Credit Card:</h2>
              <SelectTrigger>
                <SelectValue placeholder="Credit Card" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bank Name - Unique Identifier</SelectLabel>
                  {data.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.bankNameWithIdentifier}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Due Date:</h2>
            <Popover
              open={dueDatePickerOpen}
              onOpenChange={setDueDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {updatedStatement.dueDate === ""
                    ? "Select Date"
                    : updatedStatement.dueDate}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={new Date(updatedStatement.dueDate)}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (!date) return "No Date Selected";
                    const dateString = date.toLocaleDateString();
                    handleEdit("dueDate", dateString);
                    setDueDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Payment Status:</h2>
            <Select
              value={updatedStatement?.paymentStatus}
              onValueChange={(value) => {
                if (value !== "Paid") {
                  handleEdit("paymentStatus", value);
                  handleEdit("paymentDate", null);
                } else {
                  handleEdit("paymentStatus", value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Not Paid" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Not Paid">Not Paid</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Sent To Me">Sent To Me</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <h2 className="font-bold">Payment Date:</h2>
            {updatedStatement.paymentStatus !== "Paid" && <p>Not Paid</p>}
            {updatedStatement.paymentStatus === "Paid" && (
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
                    {updatedStatement.paymentDate === null
                      ? "Select Date"
                      : updatedStatement.paymentDate}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      updatedStatement.paymentDate === null
                        ? new Date()
                        : new Date(updatedStatement.paymentDate)
                    }
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (!date) return "No Date Selected";
                      const dateString = date.toLocaleDateString();
                      handleEdit("paymentDate", dateString);
                      setPaymentDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        {!isPending && (
          <DialogFooter>
            <DialogClose asChild onClick={onCloseDialog}>
              <Button>Nevermind</Button>
            </DialogClose>
            <DialogClose
              asChild
              onClick={() => {
                if (!updatedStatement) {
                  toast.error("Please complete details");
                  return;
                }
                mutate(updatedStatement);
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
