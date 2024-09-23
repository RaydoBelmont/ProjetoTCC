/*
  Warnings:

  - Added the required column `prioridadeId` to the `Chamado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chamado" ADD COLUMN     "prioridadeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Prioridade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "setorId" INTEGER NOT NULL,

    CONSTRAINT "Prioridade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_prioridadeId_fkey" FOREIGN KEY ("prioridadeId") REFERENCES "Prioridade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prioridade" ADD CONSTRAINT "Prioridade_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
