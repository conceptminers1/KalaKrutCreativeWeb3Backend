/*
  Warnings:

  - You are about to drop the `FiatTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FiatTransaction" DROP CONSTRAINT "FiatTransaction_userId_fkey";

-- DropTable
DROP TABLE "FiatTransaction";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";
