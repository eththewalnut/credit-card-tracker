/*
  Warnings:

  - The values [Paid,Not Paid,Sent To Me] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Statement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'UNPAID', 'SENT');
ALTER TABLE "public"."Statement" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Statement" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Statement" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Statement" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
