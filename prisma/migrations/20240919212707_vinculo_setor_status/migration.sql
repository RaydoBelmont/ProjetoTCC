/*
  Warnings:

  - Added the required column `setorId` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "setorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
