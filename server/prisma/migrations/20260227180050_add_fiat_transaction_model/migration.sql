-- AlterTable
ALTER TABLE "_EscrowContractToUser" ADD CONSTRAINT "_EscrowContractToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EscrowContractToUser_AB_unique";

-- AlterTable
ALTER TABLE "_SignedContracts" ADD CONSTRAINT "_SignedContracts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SignedContracts_AB_unique";
