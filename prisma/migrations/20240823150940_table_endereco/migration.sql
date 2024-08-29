/*
  Warnings:

  - You are about to drop the column `empresa` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Clientes` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clientes" DROP COLUMN "empresa",
DROP COLUMN "endereco",
ADD COLUMN     "enderecoId" INTEGER,
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;
