/*
  Warnings:

  - You are about to drop the column `listaId` on the `Quadro` table. All the data in the column will be lost.
  - You are about to drop the `Lista` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setorId` to the `Quadro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lista" DROP CONSTRAINT "Lista_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Quadro" DROP CONSTRAINT "Quadro_listaId_fkey";

-- AlterTable
ALTER TABLE "Quadro" DROP COLUMN "listaId",
ADD COLUMN     "setorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Lista";

-- CreateTable
CREATE TABLE "Setor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetorUser" (
    "setorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "SetorUser_pkey" PRIMARY KEY ("setorId","userId")
);

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorUser" ADD CONSTRAINT "SetorUser_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorUser" ADD CONSTRAINT "SetorUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quadro" ADD CONSTRAINT "Quadro_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
