/*
  Warnings:

  - You are about to drop the column `email` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Lead` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lead_email_key";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_userId_key" ON "Lead"("userId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
