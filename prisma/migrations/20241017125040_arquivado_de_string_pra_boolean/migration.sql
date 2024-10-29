/*
  Warnings:

  - The `arquivado` column on the `Chamado` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "arquivado",
ADD COLUMN     "arquivado" BOOLEAN NOT NULL DEFAULT false;
