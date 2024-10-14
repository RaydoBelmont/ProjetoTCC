/*
  Warnings:

  - Added the required column `responsavelId` to the `Quadro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quadro" ADD COLUMN     "responsavelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_SetorMembros" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SetorMembros_AB_unique" ON "_SetorMembros"("A", "B");

-- CreateIndex
CREATE INDEX "_SetorMembros_B_index" ON "_SetorMembros"("B");

-- AddForeignKey
ALTER TABLE "Quadro" ADD CONSTRAINT "Quadro_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetorMembros" ADD CONSTRAINT "_SetorMembros_A_fkey" FOREIGN KEY ("A") REFERENCES "Setor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetorMembros" ADD CONSTRAINT "_SetorMembros_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
