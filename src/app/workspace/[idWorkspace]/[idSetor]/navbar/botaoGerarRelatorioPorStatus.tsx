"use client";
import React, { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import RelChamadosPorStatus from "@/app/lib/Reports/Detalhados/ChamadosPorStatus";
import { Chamado, Quadro } from "../page";
import RelChamadosPorStatusRes from "@/app/lib/Reports/Resumidos/ChamadosPorStatusRes";

interface BotaoRelatorioChamadosPorStatusProps {
  dados: { [key: number]: Chamado[] };
  statusSelecionado?: string | null;
  idQuadro?: number | null;
  todosStatus?: boolean;
  todosQuadros?: boolean;
  listaQuadros: Quadro[];
  dataInicial: string | null;
  dataFinal: string | null;
  resumido: boolean;
}

const BotaoRelatorioChamadosPorStatus: React.FC<
  BotaoRelatorioChamadosPorStatusProps
> = ({
  dados,
  statusSelecionado,
  idQuadro,
  todosQuadros,
  todosStatus,
  listaQuadros,
  dataInicial,
  dataFinal,
  resumido,
}) => {
  // Função para validar filtros
  const validarFiltros = (): boolean => {
    // Se não for "Todos Status" e não tiver um status selecionado, retorna false
    if (!todosStatus && !statusSelecionado) {
      alert("Selecione um status ou marque 'Todos os Status'.");
      return false;
    }

    // Se não for "Todos Quadros" e não tiver um quadro selecionado, retorna false
    if (!todosQuadros && !idQuadro) {
      alert("Selecione um quadro ou marque 'Todos os Quadros'.");
      return false;
    }

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
            <RelChamadosPorStatusRes
              dados={dados}
              status={statusSelecionado ? statusSelecionado : null}
              idQuadro={idQuadro ? idQuadro : null}
              listaQuadros={listaQuadros}
              dataInicial={dataInicial}
              dataFinal={dataFinal}
            />
          ) : (
            <RelChamadosPorStatus
              dados={dados}
              status={statusSelecionado ? statusSelecionado : null}
              idQuadro={idQuadro ? idQuadro : null}
              listaQuadros={listaQuadros}
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

export default BotaoRelatorioChamadosPorStatus;
