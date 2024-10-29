"use client";
import React, { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { Chamado, Quadro } from "../page";
import { Cliente } from "../quadros/Modals/modalCadChamado";
import RelChamadosPorCliente from "@/app/lib/Reports/Detalhados/ChamadosPorCliente";
import RelChamadosPorClienteRes from "@/app/lib/Reports/Resumidos/ChamadosPorClienteRes";

interface BotaoRelatorioChamadosPorClienteProps {
  dados: { [key: number]: Chamado[] };
  statusSelecionado?: string | null;
  todosStatus?: boolean;
  listaQuadros: Quadro[];
  cliente: Cliente;
  dataInicial: string | null;
  dataFinal: string | null;
  resumido: boolean;
}

const BotaoRelatorioChamadosPorCliente: React.FC<
  BotaoRelatorioChamadosPorClienteProps
> = ({
  dados,
  statusSelecionado,
  todosStatus,
  listaQuadros,
  cliente,
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
    if (!cliente) {
      alert("Selecione um Cliente!.");
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
            <RelChamadosPorClienteRes
              dados={dados}
              status={statusSelecionado ? statusSelecionado : null}
              listaQuadros={listaQuadros}
              cliente={cliente}
              dataInicial={dataInicial}
              dataFinal={dataFinal}
            />
          ) : (
            <RelChamadosPorCliente
              dados={dados}
              status={statusSelecionado ? statusSelecionado : null}
              listaQuadros={listaQuadros}
              cliente={cliente}
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

export default BotaoRelatorioChamadosPorCliente;
