function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}
export default function objectMapper(keyObject: string) {
  const key = normalizeKey(keyObject);
  switch (key) {
    case "bank":
      return "bank";
    case "duedate":
      return "dueDate";
    case "amount":
      return "amount";
    case "billto":
      return "billTo";
    case "creditcard":
      return "creditor";
    case "status":
      return "paymentStatus";
    case "paymentdate":
      return "paymentDate";
    case "store":
      return "billFrom";
    case "date":
      return "statementDate";
    case "statementduedate":
      return "statementDueDate";
    case "cardnumber":
      return "last4Digits";
    default:
      return undefined;
  }
}
