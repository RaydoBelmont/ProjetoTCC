-- AlterTable
ALTER TABLE "Notificacao" ADD COLUMN     "aceito" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dataExpira" TIMESTAMP(3);
