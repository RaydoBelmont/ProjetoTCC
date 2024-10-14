/*
  Warnings:

  - You are about to drop the column `statusId` on the `Chamado` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('EM_ABERTO', 'EM_ANALISE', 'EM_ESPERA', 'CONCLUIDO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "Chamado" DROP CONSTRAINT "Chamado_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_setorId_fkey";

-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "statusId",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'EM_ABERTO';

-- DropTable
DROP TABLE "Status";
