/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Chamado` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Quadro` table. All the data in the column will be lost.
  - Added the required column `listaId` to the `Quadro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chamado" DROP CONSTRAINT "Chamado_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Quadro" DROP CONSTRAINT "Quadro_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Quadro" DROP COLUMN "workspaceId",
ADD COLUMN     "listaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Lista" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Lista_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lista" ADD CONSTRAINT "Lista_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quadro" ADD CONSTRAINT "Quadro_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "Lista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
