/*
  Warnings:

  - You are about to drop the `_SetorMembros` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SetorMembros" DROP CONSTRAINT "_SetorMembros_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetorMembros" DROP CONSTRAINT "_SetorMembros_B_fkey";

-- DropTable
DROP TABLE "_SetorMembros";

-- CreateTable
CREATE TABLE "SetorMembro" (
    "setorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SetorMembro_pkey" PRIMARY KEY ("setorId","userId")
);

-- AddForeignKey
ALTER TABLE "SetorMembro" ADD CONSTRAINT "SetorMembro_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorMembro" ADD CONSTRAINT "SetorMembro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
