-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Paid', 'Not Paid', 'Sent To Me');

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "billFrom" TEXT NOT NULL,
    "billTo" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Not Paid',
    "paymentDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" TEXT NOT NULL,
    "bankNameWithIdentifier" TEXT NOT NULL,
    "statementMonth" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
