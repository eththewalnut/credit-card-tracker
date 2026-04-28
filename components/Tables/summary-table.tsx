import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { UUID } from "crypto";
import objectMapper from "@/lib/objectMapper";

type SummaryTableData1 = {
  id: UUID;
  bank: string;
  dueDate: string;
  amount: number;
};

type SummaryTableData2 = {
  id: UUID;
  bank: string;
  date: string;
  statementDueDate: string;
  cardNumber: number;
};

type SummaryTableProps = {
  title: string;
  columns: string[];
  data: SummaryTableData1[] | SummaryTableData2[];
};

export default function SummaryTable({
  title,
  columns,
  data,
}: SummaryTableProps) {
  return (
    <Card className="ml-5 mt-10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((statement, index) => (
              <TableRow
                key={statement.id}
                className={index % 2 === 0 ? "bg-slate-800" : ""}
              >
                {columns.map((column) => {
                  const mappedColumn = objectMapper(column);
                  return (
                    <TableCell key={statement.id + column}>
                      {statement[mappedColumn as keyof typeof statement]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
