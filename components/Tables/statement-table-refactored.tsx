"use client";
import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatementHeaderFilter from "./components/statement-header";
import EditDialog from "../ui/dialogs/edit-dialog";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { StatementUpdate } from "@/app/(dashboard)/statements/page";
import DeleteDialog from "../ui/dialogs/delete-statement-dialog";
import { Edit, Trash2Icon } from "lucide-react";

type Statement = {
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

export default function StatementTableNew({
  data,
  onSelect,
  onDeselect,
  isChecked,
}: {
  data: Statement[];
  onSelect: (statement: StatementUpdate) => void;
  onDeselect: (statementId: StatementUpdate["statementId"]) => void;
  isChecked: string[];
}) {
  const [statementToBeUpdated, setStatementToBeUpdated] = useState<Statement>({
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

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    statementDate: "All",
    dueDate: "All",
    billFrom: "All",
    billTo: "All",
    creditor: "All",
    paymentStatus: "Not Paid",
    paymentDate: "All",
  });

  const uniqueValues = useMemo(() => {
    return {
      statementDate: [...new Set(data.map((item) => item.statementDate))],
      dueDate: [...new Set(data.map((item) => item.dueDate))],
      billFrom: [...new Set(data.map((item) => item.billFrom))],
      billTo: [...new Set(data.map((item) => item.billTo))],
      creditor: [...new Set(data.map((item) => item.bankNameWithIdentifier))],
      paymentStatus: [...new Set(data.map((item) => item.paymentStatus))],
      paymentDate: [...new Set(data.map((item) => item.paymentDate))],
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (filters.statementDate === "All" ||
          filters.statementDate === item.statementDate) &&
        (filters.dueDate === "All" || filters.dueDate === item.dueDate) &&
        (filters.billFrom === "All" || filters.billFrom === item.billFrom) &&
        (filters.billTo === "All" || filters.billTo === item.billTo) &&
        (filters.creditor === "All" ||
          filters.creditor === item.bankNameWithIdentifier) &&
        (filters.paymentStatus === "All" ||
          filters.paymentStatus === item.paymentStatus) &&
        (filters.paymentDate === "All" ||
          filters.paymentDate === item.paymentDate) &&
        item.id,
    );
  }, [data, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteStatement = (statementInfo: Statement) => {
    setStatementToBeUpdated(statementInfo);
    setIsDeleteOpen(true);
  };

  const handleEditStatement = (statementInfo: Statement) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bankNameWithIdentifier, ...formattedStatement } = statementInfo;
    setStatementToBeUpdated(formattedStatement);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteOpen(false);
    setIsEditOpen(false);
    setStatementToBeUpdated({
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
  };

  return (
    <>
      <DeleteDialog
        isOpen={isDeleteOpen}
        statementInfo={statementToBeUpdated}
        onCloseDialog={handleCloseDialog}
      />
      <EditDialog
        isOpen={isEditOpen}
        onCloseDialog={handleCloseDialog}
        statementInfo={statementToBeUpdated}
      />
      <Card className="px-20 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Statements:</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white">
                <StatementHeaderFilter
                  defaultFilterState={filters.statementDate}
                  title="Statement Date"
                  selectOptions={uniqueValues.statementDate}
                  onChange={(val: string) => {
                    handleFilterChange("statementDate", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.billFrom}
                  title="Store"
                  selectOptions={uniqueValues.billFrom}
                  onChange={(val: string) => {
                    handleFilterChange("billFrom", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.statementDate}
                  title="Amount"
                  selectOptions={uniqueValues.statementDate}
                  onChange={(val: string) => {
                    handleFilterChange("amount", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.billTo}
                  title="Bill To"
                  selectOptions={uniqueValues.billTo}
                  onChange={(val: string) => {
                    handleFilterChange("billTo", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.creditor}
                  title="Credit Card"
                  selectOptions={uniqueValues.creditor}
                  onChange={(val: string) => {
                    handleFilterChange("creditor", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.dueDate}
                  title="Due Date"
                  selectOptions={uniqueValues.dueDate}
                  onChange={(val: string) => {
                    handleFilterChange("dueDate", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.paymentStatus}
                  title="Payment Status"
                  selectOptions={uniqueValues.paymentStatus}
                  onChange={(val: string) => {
                    handleFilterChange("paymentStatus", val);
                  }}
                />
                <StatementHeaderFilter
                  defaultFilterState={filters.paymentDate}
                  title="Payment Date"
                  selectOptions={uniqueValues.paymentDate.filter(
                    (v): v is string => v !== undefined,
                  )}
                  onChange={(val: string) => {
                    handleFilterChange("paymentDate", val);
                  }}
                />
                <TableHead className="text-center">Menu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((statement: Statement, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {statement.statementDate}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.billFrom}
                  </TableCell>
                  <TableCell className="text-center">
                    ₱{statement.amount}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.billTo}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.bankNameWithIdentifier}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.dueDate}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.paymentStatus}
                  </TableCell>
                  <TableCell className="text-center">
                    {statement.paymentDate === null
                      ? "Not Paid"
                      : statement.paymentDate}
                  </TableCell>
                  <TableCell className="flex flex-row gap-3 mx-3">
                    {statement.paymentStatus !== "Paid" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Checkbox
                            checked={isChecked.includes(statement.id)}
                            onCheckedChange={(value) => {
                              if (value === true) {
                                onSelect({
                                  statementId: statement.id,
                                  statementDate: statement.statementDate,
                                  amount: statement.amount,
                                  billTo: statement.billTo,
                                  cardId: statement.cardId,
                                  bankNameWithIdentifier:
                                    statement.bankNameWithIdentifier!,
                                  dueDate: statement.dueDate,
                                  billFrom: statement.billFrom,
                                });
                              } else {
                                onDeselect(statement.id);
                              }
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark as Paid</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2Icon
                          className="w-5 h-5 cursor-pointer hover:opacity-65"
                          onClick={() => handleDeleteStatement(statement)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Statment</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Edit
                          className="w-4 h-5 cursor-pointer hover:opacity-65"
                          onClick={() => handleEditStatement(statement)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Statement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
