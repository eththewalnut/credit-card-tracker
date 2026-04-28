"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldLabel,
  Field,
} from "./field";
import { Input } from "./input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./select";
import { Button } from "./button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getCards } from "@/app/query/cards";
import { ClipLoader } from "react-spinners";
import { createQuickStatement } from "@/lib/actions/card-actions";
import { Card } from "./card";

export default function QuickStatementForm({ userId }: { userId: string }) {
  const [isSaving, startTransition] = useTransition();
  const { data, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
  });

  if (!data || data.length < 1) {
    return (
      <div className="flex items-center justify-center mx-auto my-30">
        <p className="text-lg">
          You have no cards saved at the moment. Please add your card in the{" "}
          <Link href="/cards" className="underline">
            Cards Page.
          </Link>
        </p>
      </div>
    );
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createQuickStatement(formData, userId);

      if (!result.success) {
        toast.error(result.message);
        console.log(formData);
      } else {
        toast.success(result.message);
      }
    });
  }

  return (
    <Card className="rounded-lg p-3 border bg-white">
      {isLoading || isSaving ? (
        <div className="flex items-center justify-center flex-col bg-black/40 h-96">
          <ClipLoader color="#899499" size={50} />
          <p className="animate-pulse">Loading. Please wait...</p>
        </div>
      ) : (
        <form action={(formData) => handleSubmit(formData)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Quick add statement</FieldLegend>
              <FieldDescription>
                Add a single UNPAID statement. If you need to add more
                simultaneously or add PAID statements please go to{" "}
                <Link href="/statements/add">Add Statements</Link>.
              </FieldDescription>
            </FieldSet>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-2 mt-2">
            <Field>
              <FieldLabel htmlFor="statement-date">Statement Date:</FieldLabel>
              <Input
                type="date"
                id="statement-date"
                required
                name="statementDate"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="due-date">Due Date:</FieldLabel>
              <Input type="date" id="due-date" required name="dueDate" />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-from">Store:</FieldLabel>
              <Input type="text" id="bill-from" required name="billFrom" />
            </Field>
            <Field>
              <FieldLabel htmlFor="amount">Amount:</FieldLabel>
              <Input
                type="number"
                id="amount"
                required
                name="amount"
                step="0.01"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bill-to">Bill to:</FieldLabel>
              <Input type="text" id="bill-to" required name="billTo" />
            </Field>
            <Field>
              <FieldLabel htmlFor="credit-card">Credit Card:</FieldLabel>
              <Select name="creditCard">
                <SelectTrigger>
                  <SelectValue placeholder="Select a credit card" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.bankNameWithIdentifier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field className="col-span-2">
              <Button type="submit" className="hover:cursor-pointer">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </Card>
  );
}
