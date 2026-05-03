type StatementFormObject = {
  id?: string;
  statementDate: Date | undefined;
  billFrom: string;
  amount: number;
  billTo: string;
  cardId: string;
  dueDate: Date | undefined;
  paymentStatus: "Paid" | "Not Paid" | "Sent To Me";
  paymentDate?: Date | null;
  bankNameWithIdentifier: string;
};

type StatementReqObject = {
  id: string;
  statementDate: string;
  billFrom: string;
  amount: number;
  billTo: string;
  cardId: string;
  dueDate: string;
  paymentStatus: "Paid" | "Not Paid" | "Sent To Me";
  paymentDate: string | null;
};
export async function getStatements() {
  const response = await fetch("/api/statements");
  const statements: StatementReqObject[] = await response.json();
  return statements;
}

export async function createStatements(statementForm: StatementFormObject[]) {
  const response = await fetch("/api/statements", {
    method: "POST",
    body: JSON.stringify(statementForm),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response;
}

export async function deleteStatement(statementId: string) {
  const response = await fetch(`/api/statements/${statementId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response;
}

export async function updateStatement(updatedStatement: StatementReqObject) {
  const { id, ...dataWithoutID } = updatedStatement;
  const response = await fetch(`/api/statements/${id}`, {
    method: "PUT",
    body: JSON.stringify(dataWithoutID),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response;
}

export async function markStatementsAsPaid({
  statementIds,
  paymentDate,
}: {
  statementIds: string[];
  paymentDate: Date;
}) {
  const response = await fetch("/api/statements/pay", {
    method: "PUT",
    body: JSON.stringify({
      statementIds,
      paymentDate,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response;
}

export async function getStatement(statementId: string) {
  const response = await fetch(`/api/statements/${statementId}`);
  const statement: StatementReqObject = await response.json();

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return statement;
}
