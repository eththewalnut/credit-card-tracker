"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Statement = {
  id: string;
  amount: number;
  statementDate: string;
  dueDate: string;
  bankNameWithIdentifier: string;
  billFrom: string;
  billTo: string;
};

export const columns: ColumnDef<Statement>[] = [
  {
    accessorKey: "statementDate",
    header: "Statement Date",
  },
  {
    accessorKey: "billFrom",
    header: "Store",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "billTo",
    header: "Bill To",
  },
  {
    accessorKey: "bankNameWithIdentifier",
    header: "Credit Card",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
];
