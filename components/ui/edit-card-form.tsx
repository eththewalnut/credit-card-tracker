"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { editCard } from "@/lib/actions/card-actions";
import { toast } from "sonner";
import LoaderOverlay from "./loader-overlay";
import { useRouter } from "next/navigation";
import { Card } from "./card";
type Props = {
  cardDetails: {
    id: string;
    bankNameWithIdentifier: string;
    statementMonth: string;
    dueDate: string;
  };
  userId: string;
};

export default function EditCardForm({ cardDetails, userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await editCard(formData, userId);
      if (response?.success === true) {
        toast.success(response.message);
        router.push("/cards");
      } else toast.error(response?.message || "Something went wrong!");
    });
  }

  const bankName = cardDetails.bankNameWithIdentifier.split(" - ")[0];
  const identifier = cardDetails.bankNameWithIdentifier.includes(" - ")
    ? cardDetails.bankNameWithIdentifier.split(" - ")[1]
    : null;
  return (
    <Card className="p-10">
      <LoaderOverlay loading={isPending} loadingText="Please wait..." />
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Edit Card Details</FieldLegend>
            <FieldDescription>Update your card details here</FieldDescription>
            <FieldGroup>
              <Field hidden>
                <Input
                  id="id"
                  name="id"
                  defaultValue={cardDetails?.id}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bankName">Bank</FieldLabel>
                <Input
                  id="bank-name"
                  name="bankName"
                  defaultValue={bankName ? bankName : ""}
                  placeholder="ex. BDO, BPI, EastWest"
                  maxLength={20}
                  required
                />
                <FieldDescription> ex. BDO, BPI, EastWest</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="bankName">Identifier</FieldLabel>
                <Input
                  id="identifier"
                  name="identifier"
                  defaultValue={identifier ? identifier : undefined}
                  placeholder="ex. VISA, AMEX or any identifier that would help you differentiate in case of similar cards. (max 10 characters)"
                  maxLength={10}
                />
                <FieldDescription>
                  ex. VISA, AMEX or any identifier that would help you
                  differentiate in case of similar cards. (max 10 characters)
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="statementDate">
                    Statement Date
                  </FieldLabel>
                  <Select
                    name="statementDate"
                    required
                    key={Math.random()}
                    defaultValue={cardDetails?.statementMonth}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select statement billing date" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const suffix =
                          day % 100 >= 11 && day % 100 <= 13
                            ? "th"
                            : day % 10 === 1
                              ? "st"
                              : day % 10 === 2
                                ? "nd"
                                : day % 10 === 3
                                  ? "rd"
                                  : "th";
                        return (
                          <SelectItem key={day} value={String(day) + suffix}>
                            {day}
                            {suffix} of the month
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                  <Select
                    name="dueDate"
                    required
                    key={Math.random()}
                    defaultValue={cardDetails?.dueDate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select statement due date" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const suffix =
                          day % 100 >= 11 && day % 100 <= 13
                            ? "th"
                            : day % 10 === 1
                              ? "st"
                              : day % 10 === 2
                                ? "nd"
                                : day % 10 === 3
                                  ? "rd"
                                  : "th";
                        return (
                          <SelectItem key={day} value={String(day) + suffix}>
                            {day}
                            {suffix} of the month
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          {isPending ? (
            "Saving..."
          ) : (
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Link href="../">
                <Button
                  variant="outline"
                  type="button"
                  className="hover:cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
            </Field>
          )}
        </FieldGroup>
      </form>
    </Card>
  );
}
