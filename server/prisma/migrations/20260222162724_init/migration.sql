/*
  Warnings:

  - You are about to drop the column `coverImage` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `musicBrainzId` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ArtistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `arbiterId` on the `EscrowContract` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiaryId` on the `EscrowContract` table. All the data in the column will be lost.
  - You are about to drop the column `contractAddress` on the `EscrowContract` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EscrowContract` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EscrowContract` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `EscrowContract` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - The `status` column on the `EscrowContract` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `uri` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `EventTicket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EventTicket` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EventTicket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `tokenURI` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DAODelegation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DAOProposal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DAOVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FractionalTokenHolder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FractionalizedNFT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JoinRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KalaKrutGovernor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KalaKrutToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketplaceListing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModerationCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reading` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Timelock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Treasury` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contractId]` on the table `EscrowContract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[escrowAddress]` on the table `EscrowContract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gigId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractAddress]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenId]` on the table `EventTicket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractAddress,tokenId]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractId` to the `EscrowContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `escrowAddress` to the `EscrowContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gigId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractAddress` to the `EventTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractAddress` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadataUrl` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ARTIST', 'VENUE', 'SERVICE_PROVIDER', 'ORGANIZER', 'SPONSOR', 'REVELLER', 'ADMIN', 'DAO_GOVERNOR', 'DAO_MEMBER', 'SYSTEM_ADMIN_LIVE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'SIGNED', 'ACTIVE', 'FULFILLED', 'DISPUTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACTIVE', 'PASSED', 'FAILED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('CREATED', 'FUNDED', 'RELEASED', 'REFUNDED', 'DISPUTED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_artistManagerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bookedUserId_fkey";

-- DropForeignKey
ALTER TABLE "DAODelegation" DROP CONSTRAINT "DAODelegation_delegateeId_fkey";

-- DropForeignKey
ALTER TABLE "DAODelegation" DROP CONSTRAINT "DAODelegation_delegatorId_fkey";

-- DropForeignKey
ALTER TABLE "DAOProposal" DROP CONSTRAINT "DAOProposal_proposerId_fkey";

-- DropForeignKey
ALTER TABLE "DAOVote" DROP CONSTRAINT "DAOVote_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "DAOVote" DROP CONSTRAINT "DAOVote_voterId_fkey";

-- DropForeignKey
ALTER TABLE "EscrowContract" DROP CONSTRAINT "EscrowContract_arbiterId_fkey";

-- DropForeignKey
ALTER TABLE "EscrowContract" DROP CONSTRAINT "EscrowContract_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "FractionalTokenHolder" DROP CONSTRAINT "FractionalTokenHolder_fractionalizedNFTId_fkey";

-- DropForeignKey
ALTER TABLE "FractionalTokenHolder" DROP CONSTRAINT "FractionalTokenHolder_holderId_fkey";

-- DropForeignKey
ALTER TABLE "FractionalizedNFT" DROP CONSTRAINT "FractionalizedNFT_nftId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_userId_fkey";

-- DropForeignKey
ALTER TABLE "MarketplaceListing" DROP CONSTRAINT "MarketplaceListing_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Metrics" DROP CONSTRAINT "Metrics_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ModerationCase" DROP CONSTRAINT "ModerationCase_userId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_readingSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSession" DROP CONSTRAINT "ReadingSession_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSession" DROP CONSTRAINT "ReadingSession_userId_fkey";

-- DropIndex
DROP INDEX "ArtistProfile_musicBrainzId_key";

-- DropIndex
DROP INDEX "EscrowContract_contractAddress_key";

-- DropIndex
DROP INDEX "Event_uri_key";

-- DropIndex
DROP INDEX "EventTicket_eventId_ownerId_tokenId_key";

-- DropIndex
DROP INDEX "NFT_tokenId_key";

-- DropIndex
DROP INDEX "User_walletAddress_key";

-- AlterTable
ALTER TABLE "ArtistProfile" DROP COLUMN "coverImage",
DROP COLUMN "createdAt",
DROP COLUMN "location",
DROP COLUMN "musicBrainzId",
DROP COLUMN "updatedAt",
DROP COLUMN "verified",
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "techRiderUrl" TEXT;

-- AlterTable
ALTER TABLE "EscrowContract" DROP COLUMN "arbiterId",
DROP COLUMN "beneficiaryId",
DROP COLUMN "contractAddress",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "contractId" TEXT NOT NULL,
ADD COLUMN     "escrowAddress" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "status",
ADD COLUMN     "status" "EscrowStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "updatedAt",
DROP COLUMN "uri",
ADD COLUMN     "contractAddress" TEXT,
ADD COLUMN     "gigId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventTicket" DROP COLUMN "balance",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "contractAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "createdAt",
DROP COLUMN "creatorId",
DROP COLUMN "name",
DROP COLUMN "symbol",
DROP COLUMN "tokenURI",
DROP COLUMN "updatedAt",
ADD COLUMN     "contractAddress" TEXT NOT NULL,
ADD COLUMN     "metadataUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
DROP COLUMN "walletAddress",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'REVELLER';

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "DAODelegation";

-- DropTable
DROP TABLE "DAOProposal";

-- DropTable
DROP TABLE "DAOVote";

-- DropTable
DROP TABLE "FractionalTokenHolder";

-- DropTable
DROP TABLE "FractionalizedNFT";

-- DropTable
DROP TABLE "JoinRequest";

-- DropTable
DROP TABLE "KalaKrutGovernor";

-- DropTable
DROP TABLE "KalaKrutToken";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "MarketplaceListing";

-- DropTable
DROP TABLE "Metrics";

-- DropTable
DROP TABLE "ModerationCase";

-- DropTable
DROP TABLE "Reading";

-- DropTable
DROP TABLE "ReadingSession";

-- DropTable
DROP TABLE "Timelock";

-- DropTable
DROP TABLE "Treasury";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,

    CONSTRAINT "OnboardingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT,
    "capacity" INTEGER,
    "amenities" TEXT[],

    CONSTRAINT "VenueProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "website" TEXT,
    "focusAreas" TEXT[],

    CONSTRAINT "SponsorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organization" TEXT,
    "pastEvents" TEXT[],

    CONSTRAINT "OrganizerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "rate" TEXT,
    "availability" TEXT,

    CONSTRAINT "ServiceProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaoMemberProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "votingPower" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DaoMemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "gigId" TEXT,
    "initiatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "proposerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "choice" BOOLEAN NOT NULL,
    "votingPower" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fractionalize" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "totalSupply" BIGINT NOT NULL,

    CONSTRAINT "Fractionalize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FractionalTokenOwner" (
    "id" TEXT NOT NULL,
    "fractionalizeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "balance" BIGINT NOT NULL,

    CONSTRAINT "FractionalTokenOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SignedContracts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SignedContracts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EscrowContractToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EscrowContractToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingRequest_userId_key" ON "OnboardingRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueProfile_userId_key" ON "VenueProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorProfile_userId_key" ON "SponsorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizerProfile_userId_key" ON "OrganizerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderProfile_userId_key" ON "ServiceProviderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DaoMemberProfile_userId_key" ON "DaoMemberProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_proposalId_voterId_key" ON "Vote"("proposalId", "voterId");

-- CreateIndex
CREATE UNIQUE INDEX "Fractionalize_nftId_key" ON "Fractionalize"("nftId");

-- CreateIndex
CREATE UNIQUE INDEX "Fractionalize_tokenAddress_key" ON "Fractionalize"("tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "FractionalTokenOwner_fractionalizeId_ownerId_key" ON "FractionalTokenOwner"("fractionalizeId", "ownerId");

-- CreateIndex
CREATE INDEX "_SignedContracts_B_index" ON "_SignedContracts"("B");

-- CreateIndex
CREATE INDEX "_EscrowContractToUser_B_index" ON "_EscrowContractToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowContract_contractId_key" ON "EscrowContract"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowContract_escrowAddress_key" ON "EscrowContract"("escrowAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Event_gigId_key" ON "Event"("gigId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_contractAddress_key" ON "Event"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "EventTicket_tokenId_key" ON "EventTicket"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_contractAddress_tokenId_key" ON "NFT"("contractAddress", "tokenId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingRequest" ADD CONSTRAINT "OnboardingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueProfile" ADD CONSTRAINT "VenueProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorProfile" ADD CONSTRAINT "SponsorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizerProfile" ADD CONSTRAINT "OrganizerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProviderProfile" ADD CONSTRAINT "ServiceProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaoMemberProfile" ADD CONSTRAINT "DaoMemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fractionalize" ADD CONSTRAINT "Fractionalize_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FractionalTokenOwner" ADD CONSTRAINT "FractionalTokenOwner_fractionalizeId_fkey" FOREIGN KEY ("fractionalizeId") REFERENCES "Fractionalize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FractionalTokenOwner" ADD CONSTRAINT "FractionalTokenOwner_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowContract" ADD CONSTRAINT "EscrowContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignedContracts" ADD CONSTRAINT "_SignedContracts_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SignedContracts" ADD CONSTRAINT "_SignedContracts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EscrowContractToUser" ADD CONSTRAINT "_EscrowContractToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "EscrowContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EscrowContractToUser" ADD CONSTRAINT "_EscrowContractToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
