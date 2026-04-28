"use client";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "./select";
import { useState } from "react";
import { createCardDetails } from "@/lib/actions/card-actions";

export default function CardForm({ userId }: { userId: string }) {
  const [loading, isLoading] = useState(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createCardDetails(formData, userId);
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading(false);
    }
  };
  return (
    <Card className="w-7xl mt-20 mx-auto">
      <CardHeader>
        <CardTitle>Add a card?</CardTitle>
        <CardDescription>
          Add your credit card billing summary here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler}>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-blue-500"></div>
              <p className="ml-3 text-md">Please wait...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="bank">Issuing bank:</Label>
                <Input
                  id="bank"
                  name="bank"
                  type="text"
                  placeholder="ex. BDO, BPI, EastWest"
                  maxLength={20}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="identifier">Unique Identifier:</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="ex. VISA, AMEX or any identifier that would help you differentiate in case of similar cards. (max 10 characters)"
                  maxLength={10}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statement-date">
                  Estimated statement billing date:
                </Label>
                <Select name="billingDate" required key={Math.random()}>
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due-date">
                  Estimated statement billing due date:
                </Label>
                <Select name="dueDate" required key={Math.random()}>
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
              </div>
            </div>
          )}
          <CardFooter className="mt-10">
            <Button type="submit" className="w-full" disabled={loading}>
              Submit card details
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
