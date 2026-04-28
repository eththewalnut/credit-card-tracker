"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";

type StatementObject = {
  statementDate: Date | undefined;
  dueDate: Date | undefined;
  billFrom: string;
  billTo: string;
  cardId: string;
  paymentStatus: "Paid" | "Not Paid" | "Sent To Me";
  paymentDate?: Date;
  amount: number;
};

type Props = {
  statementIndex: number;
  data: StatementObject;
  onUpdate: (index: number, statement: StatementObject) => void;
  cardOptions: {
    id: string;
    bankNameWithIdentifier: string;
  }[];
};

export default function StatementForm({
  statementIndex,
  data,
  onUpdate,
  cardOptions,
}: Props) {
  const [statementDatePickerOpen, setStatementDatePickerOpen] =
    useState<boolean>(false);
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState<boolean>(false);
  const [paymentDatePickerOpen, setPaymentDatePickerOpen] =
    useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    onUpdate(statementIndex, {
      ...data,
      [name]: name === "amount" ? +value : value,
    });
  }

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor={`statementDate-${statementIndex}`}>
          Statement Date
        </Label>
        <Popover
          open={statementDatePickerOpen}
          onOpenChange={setStatementDatePickerOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {data.statementDate
                ? data.statementDate.toLocaleDateString()
                : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={data.statementDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                onUpdate(statementIndex, { ...data, statementDate: date });
                setStatementDatePickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`billFrom-${statementIndex}`}>Store</Label>
        <Input
          name="billFrom"
          id={`billFrom-${statementIndex}`}
          type="text"
          value={data.billFrom}
          required
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`amount-${statementIndex}`}>Amount</Label>
        <Input
          required
          name="amount"
          id={`amount-${statementIndex}`}
          type="number"
          value={data.amount}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`billTo-${statementIndex}`}>Bill To</Label>
        <Input
          required
          id={`billTo-${statementIndex}`}
          name="billTo"
          type="text"
          value={data.billTo}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-3">
        <Select
          required
          value={data.cardId}
          onValueChange={(value) => {
            onUpdate(statementIndex, { ...data, cardId: value });
          }}
        >
          <Label htmlFor={`creditor-${statementIndex}`}>Credit Card</Label>
          <SelectTrigger>
            <SelectValue placeholder="Credit Card" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bank Name - Unique Identifier</SelectLabel>
              {cardOptions.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.bankNameWithIdentifier}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`dueDate-${statementIndex}`}>Due Date</Label>
        <Popover open={dueDatePickerOpen} onOpenChange={setDueDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {data.dueDate ? data.dueDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={data.dueDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                onUpdate(statementIndex, { ...data, dueDate: date });
                setDueDatePickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-3">
        <Select
          required
          value={data.paymentStatus}
          onValueChange={(value) => {
            if (value !== "Paid") {
              onUpdate(statementIndex, {
                ...data,
                paymentStatus: value as StatementObject["paymentStatus"],
                paymentDate: undefined,
              });
            } else {
              onUpdate(statementIndex, {
                ...data,
                paymentStatus: value as StatementObject["paymentStatus"],
              });
            }
          }}
        >
          <Label htmlFor={`paymentStatus-${statementIndex}`}>
            Payment Status
          </Label>
          <SelectTrigger>
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Payment Status</SelectLabel>
              <SelectItem value="Not Paid">Not Paid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Sent To Me">Sent To Me</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {data.paymentStatus === "Paid" && (
        <div className="grid gap-3">
          <Label htmlFor={`paymentDate-${statementIndex}`}>Payment Date</Label>
          <Popover
            open={paymentDatePickerOpen}
            onOpenChange={setPaymentDatePickerOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {data.paymentDate
                  ? data.paymentDate.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={data.paymentDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  onUpdate(statementIndex, { ...data, paymentDate: date });
                  setPaymentDatePickerOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
