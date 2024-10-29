/*
  Warnings:

  - You are about to drop the column `concluidoEmail` on the `Chamado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "concluidoEmail",
ADD COLUMN     "concluidoEm" TIMESTAMP(3);
