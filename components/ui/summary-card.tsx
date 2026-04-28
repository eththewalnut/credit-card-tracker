import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

type Props = {
  bankName: string;
  statementDate: string;
  dueDate: Date;
  statementDue: string;
  totalAmount: number;
};

export default function SummaryCard({
  bankName,
  statementDate,
  dueDate,
  statementDue,
  totalAmount,
}: Props) {
  const currentDate = new Date();
  const overDueStatement =
    currentDate > dueDate
      ? "w-19/20 my-3 animate-shake border-red-500"
      : "w-19/20 my-3";
  return (
    <Card className={overDueStatement}>
      <CardHeader>
        <CardTitle className="text-xl">{bankName}</CardTitle>
        <CardDescription className="text-color-white text-md">
          <p>Statement day: {statementDate} of the month</p>
          <p>Due date: {statementDue} of the month</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-md">
        <h2>Due: {dueDate.toLocaleDateString()}</h2>
        <h3
          className={
            currentDate > dueDate ? "underline decoration-red-800" : undefined
          }
        >
          Total amount: ₱{totalAmount}
        </h3>
      </CardContent>
    </Card>
  );
}
