/*
  Warnings:

  - The primary key for the `_EscrowContractToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_SignedContracts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_EscrowContractToUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_SignedContracts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_EscrowContractToUser" DROP CONSTRAINT "_EscrowContractToUser_AB_pkey";

-- AlterTable
ALTER TABLE "_SignedContracts" DROP CONSTRAINT "_SignedContracts_AB_pkey";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_userId_key" ON "Lead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_EscrowContractToUser_AB_unique" ON "_EscrowContractToUser"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_SignedContracts_AB_unique" ON "_SignedContracts"("A", "B");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
