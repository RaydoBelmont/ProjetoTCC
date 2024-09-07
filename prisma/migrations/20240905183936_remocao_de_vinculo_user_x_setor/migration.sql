/*
  Warnings:

  - You are about to drop the `SetorUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SetorUser" DROP CONSTRAINT "SetorUser_setorId_fkey";

-- DropForeignKey
ALTER TABLE "SetorUser" DROP CONSTRAINT "SetorUser_userId_fkey";

-- DropTable
DROP TABLE "SetorUser";
