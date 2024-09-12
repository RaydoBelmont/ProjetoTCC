/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,numeroSequencial]` on the table `Chamado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numeroSequencial` to the `Chamado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Chamado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chamado" ADD COLUMN     "numeroSequencial" INTEGER NOT NULL,
ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chamado_workspaceId_numeroSequencial_key" ON "Chamado"("workspaceId", "numeroSequencial");
