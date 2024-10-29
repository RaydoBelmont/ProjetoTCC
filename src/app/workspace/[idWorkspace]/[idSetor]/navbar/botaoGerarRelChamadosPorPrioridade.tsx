"use client";
import React, { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { Chamado, Quadro } from "../page";
import { Cliente, Prioridade } from "../quadros/Modals/modalCadChamado";
import RelChamadosPorCliente from "@/app/lib/Reports/Detalhados/ChamadosPorCliente";
import RelChamadosPorPrioridade from "@/app/lib/Reports/Detalhados/ChamadosPorPrioridade";
import RelChamadosPrioridadeResumido from "@/app/lib/Reports/Resumidos/ChamadosPorPrioridadeRes";

interface BotaoRelatorioChamadosPorPrioridadeProps {
  dados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
  prioridadeSelecionada: Prioridade | null;
  dataInicial: string | null;
  dataFinal: string | null;
  resumido: boolean;
}

const BotaoRelatorioChamadosPorPrioridade: React.FC<
BotaoRelatorioChamadosPorPrioridadeProps
> = ({
  dados,
  listaQuadros,
  prioridadeSelecionada,
  dataInicial,
  dataFinal,
  resumido,
}) => {
  // Função para validar filtros
  const validarFiltros = (): boolean => {
    // Verifica se apenas uma das datas foi informada
    if ((dataInicial && !dataFinal) || (!dataInicial && dataFinal)) {
      alert("Informe uma data correta ou desative o filtro de data!");
      return false;
    }
  
    // Verifica se a data inicial é maior que a data final
    if (dataInicial && dataFinal) {
      const inicio = new Date(dataInicial);
      const fim = new Date(dataFinal);
  
      if (inicio > fim) {
        alert("A data inicial não pode ser maior que a data final!");
        return false;
      }
    }
  
    return true; // Filtros válidos
  };
  

  // Função para lidar com a geração do relatório
  const handleGenerateReport = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // Impedir a geração do PDF se os filtros não forem válidos
    if (!validarFiltros()) {
      event.preventDefault(); // Previne a abertura do link
      return;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <BlobProvider
        document={
          resumido ? (
            <RelChamadosPrioridadeResumido
              dados={dados}
              listaQuadros={listaQuadros}
              prioridadeSelecionada={prioridadeSelecionada}
              dataInicial={dataInicial}
              dataFinal={dataFinal}
            />
          ) : (
            <RelChamadosPorPrioridade
              dados={dados}
              listaQuadros={listaQuadros}
              prioridadeSelecionada={prioridadeSelecionada}
              dataInicial={dataInicial}
              dataFinal={dataFinal}
            />
          )
        }
      >
        {({ url, loading, error }) => {
          if (loading) {
            return <span>Gerando PDF...</span>;
          }
          if (error) {
            return <span>Erro ao gerar PDF.</span>;
          }
          return (
            <>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleGenerateReport} // Chama a função de validação ao clicar
              >
                Gerar PDF
              </a>
            </>
          );
        }}
      </BlobProvider>
    </div>
  );
};

export default BotaoRelatorioChamadosPorPrioridade;
