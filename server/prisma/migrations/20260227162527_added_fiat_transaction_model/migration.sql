/*
  Warnings:

  - The primary key for the `_EscrowContractToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_SignedContracts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_EscrowContractToUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_SignedContracts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('OPERATIONAL_EXPENSE', 'GRANT_PAYOUT', 'SPONSORSHIP_INCOME', 'TICKET_SALE', 'MERCH_SALE', 'OTHER_REVENUE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "_EscrowContractToUser" DROP CONSTRAINT "_EscrowContractToUser_AB_pkey";

-- AlterTable
ALTER TABLE "_SignedContracts" DROP CONSTRAINT "_SignedContracts_AB_pkey";

-- CreateTable
CREATE TABLE "FiatTransaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "referenceId" TEXT,
    "notes" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiatTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiatTransaction_referenceId_key" ON "FiatTransaction"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "_EscrowContractToUser_AB_unique" ON "_EscrowContractToUser"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_SignedContracts_AB_unique" ON "_SignedContracts"("A", "B");

-- AddForeignKey
ALTER TABLE "FiatTransaction" ADD CONSTRAINT "FiatTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
