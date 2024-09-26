-- CreateTable
CREATE TABLE "ChamadoHistorico" (
    "id" SERIAL NOT NULL,
    "chamadoId" INTEGER NOT NULL,
    "alteradoPorId" INTEGER,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChamadoHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChamadoHistorico_chamadoId_idx" ON "ChamadoHistorico"("chamadoId");

-- CreateIndex
CREATE INDEX "ChamadoHistorico_alteradoPorId_idx" ON "ChamadoHistorico"("alteradoPorId");

-- AddForeignKey
ALTER TABLE "ChamadoHistorico" ADD CONSTRAINT "ChamadoHistorico_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "Chamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChamadoHistorico" ADD CONSTRAINT "ChamadoHistorico_alteradoPorId_fkey" FOREIGN KEY ("alteradoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
