/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[artistName]` on the table `ArtistProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizerName]` on the table `OrganizerProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceProviderName]` on the table `ServiceProviderProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sponsorName]` on the table `SponsorProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[venueName]` on the table `VenueProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistName` to the `ArtistProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerName` to the `OrganizerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceProviderName` to the `ServiceProviderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sponsorName` to the `SponsorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueName` to the `VenueProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistProfile" ADD COLUMN     "artistName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizerProfile" ADD COLUMN     "organizerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceProviderProfile" ADD COLUMN     "serviceProviderName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SponsorProfile" ADD COLUMN     "sponsorName" TEXT NOT NULL,
ADD COLUMN     "sponsorshipTier" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "VenueProfile" ADD COLUMN     "bookingEmail" TEXT,
ADD COLUMN     "venueName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_EscrowContractToUser" ADD CONSTRAINT "_EscrowContractToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EscrowContractToUser_AB_unique";

-- AlterTable
ALTER TABLE "_SignedContracts" ADD CONSTRAINT "_SignedContracts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SignedContracts_AB_unique";

-- CreateTable
CREATE TABLE "RevellerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "RevellerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevellerProfile_userId_key" ON "RevellerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistProfile_artistName_key" ON "ArtistProfile"("artistName");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizerProfile_organizerName_key" ON "OrganizerProfile"("organizerName");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderProfile_serviceProviderName_key" ON "ServiceProviderProfile"("serviceProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorProfile_sponsorName_key" ON "SponsorProfile"("sponsorName");

-- CreateIndex
CREATE UNIQUE INDEX "VenueProfile_venueName_key" ON "VenueProfile"("venueName");

-- AddForeignKey
ALTER TABLE "RevellerProfile" ADD CONSTRAINT "RevellerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
