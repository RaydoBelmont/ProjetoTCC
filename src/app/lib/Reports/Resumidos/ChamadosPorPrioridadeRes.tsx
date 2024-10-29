import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Chamado, Quadro } from "@/app/workspace/[idWorkspace]/[idSetor]/page";
import { Prioridade } from "@/app/workspace/[idWorkspace]/[idSetor]/quadros/Modals/modalCadChamado";

// Definição dos estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  prioridadeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  lineSeparator: {
    height: 1,
    backgroundColor: "#aaa", // Cor da linha
    marginTop: 5,
    marginBottom: 10,
  },
  quadroTitleContainer: {
    backgroundColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  quadroTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "2px solid #333",
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 5
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: "center",
  },
  total: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "right",
  },
});

// Lista de status
const statusList = {
  EM_ABERTO: "Em Aberto",
  EM_ANALISE: "Em Análise",
  EM_ESPERA: "Em Espera",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
};

// Definição das props do documento
interface RelChamadosResumidoProps {
  dados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
  prioridadeSelecionada: Prioridade | null;
  dataInicial: string | null;
  dataFinal: string | null;
}

export default function RelChamadosPrioridadeResumido({
  dados,
  listaQuadros,
  prioridadeSelecionada,
  dataInicial,
  dataFinal,
}: RelChamadosResumidoProps) {
  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };

  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;

  let totalChamados = 0;

  // Filtra e organiza os chamados por prioridade e datas
  const chamadosFiltrados = Object.values(dados).flatMap((chamados) =>
    chamados.filter((chamado) => {
      // Ajusta a data do chamado para garantir que hora, minuto e segundo sejam zerados
      const dataChamado = new Date(chamado.criadoEm);
      dataChamado.setHours(0, 0, 0, 0); // Remove a hora para considerar apenas o dia

      const isDataValida =
        (!dataInicio || dataChamado >= dataInicio) &&
        (!dataFim || dataChamado <= dataFim);
      const isPrioridadeValida =
        !prioridadeSelecionada ||
        chamado.prioridadeId === prioridadeSelecionada.id;
      return isDataValida && isPrioridadeValida;
    })
  );

  // Agrupamento por prioridade
  const prioridadesUnicas = Array.from(
    new Set(chamadosFiltrados.map((c) => c.prioridade.nome))
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Chamados por Prioridade - Resumido</Text>
        <Text style={styles.title}>
          {dataInicio && dataFim
            ? `De: ${dataInicio.toLocaleDateString(
                "pt-BR"
              )} - Até: ${dataFim.toLocaleDateString("pt-BR")}`
            : ""}
        </Text>

        {prioridadesUnicas.map((prioridadeNome) => {
          const chamadosPorPrioridade = chamadosFiltrados.filter(
            (chamado) => chamado.prioridade.nome === prioridadeNome
          );
          if (chamadosPorPrioridade.length === 0) return null;

          return (
            <View key={prioridadeNome}>
              <Text style={styles.prioridadeTitle}>
                Prioridade: {prioridadeNome}
              </Text>
              <View style={styles.lineSeparator} />

              {/* Organiza chamados por quadro */}
              {Object.entries(dados).map(([quadroId]) => {
                const chamadosDoQuadro = chamadosPorPrioridade.filter(
                  (chamado) => chamado.quadroId === Number(quadroId)
                );

                if (chamadosDoQuadro.length === 0) return null;

                return (
                  <View key={quadroId}>
                    <View style={styles.quadroTitleContainer}>
                      <Text style={styles.quadroTitle}>
                        Quadro: {getQuadroNome(Number(quadroId))}
                      </Text>
                      <Text style={styles.quadroTitle}>Total: {chamadosDoQuadro.length}</Text>
                    </View>

                    {/* Cabeçalho da tabela */}
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Data</Text>
                      <Text style={styles.tableHeaderCell}>Nº</Text>
                      <Text style={styles.tableHeaderCell}>Cliente</Text>
                      <Text style={styles.tableHeaderCell}>Prioridade</Text>
                      <Text style={styles.tableHeaderCell}>Status</Text>
                    </View>

                    {/* Linhas dos chamados */}
                    {chamadosDoQuadro.map((chamado) => {
                      totalChamados++;
                      return (
                        <View key={chamado.id} style={styles.tableRow}>
                          <Text style={styles.tableCell}>
                          {new Date(chamado.criadoEm).toLocaleDateString('pt-BR')}
                          </Text>
                          <Text style={styles.tableCell}>
                            {chamado.numeroSequencial}
                          </Text>
                          <Text style={styles.tableCell}>
                            {chamado.cliente.nome}
                          </Text>
                          <Text style={styles.tableCell}>
                            {chamado.prioridade.nome}
                          </Text>
                          <Text style={styles.tableCell}>
                            {statusList[chamado.status]}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Total geral de chamados */}
        <Text style={styles.total}>
          Total Geral de Chamados: {totalChamados}
        </Text>
      </Page>
    </Document>
  );
}
