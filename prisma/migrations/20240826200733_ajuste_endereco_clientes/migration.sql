/*
  Warnings:

  - You are about to drop the column `enderecoId` on the `Clientes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clienteId]` on the table `Endereco` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clienteId` to the `Endereco` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_enderecoId_fkey";

-- AlterTable
ALTER TABLE "Chamado" ALTER COLUMN "criadoEm" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clientes" DROP COLUMN "enderecoId",
ALTER COLUMN "razao" DROP NOT NULL,
ALTER COLUMN "iE" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "observacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "clienteId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_clienteId_key" ON "Endereco"("clienteId");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
