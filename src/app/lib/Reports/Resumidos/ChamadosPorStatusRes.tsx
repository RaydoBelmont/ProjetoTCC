import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Chamado, Quadro } from "@/app/workspace/[idWorkspace]/[idSetor]/page";

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
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
    marginTop: 5,
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

const statusList = {
  EM_ABERTO: "Em Aberto",
  EM_ANALISE: "Em Análise",
  EM_ESPERA: "Em Espera",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
};

interface RelChamadosPorStatusResProps {
  dados: { [key: number]: Chamado[] };
  idQuadro?: number;
  status?: string | null;
  listaQuadros: Quadro[];
  dataInicial: string | null;
  dataFinal: string | null;
}

export default function RelChamadosPorStatusRes({
  dados,
  idQuadro,
  status,
  listaQuadros,
  dataInicial,
  dataFinal,
}: RelChamadosPorStatusResProps) {
  const quadrosFiltrados = idQuadro ? { [idQuadro]: dados[idQuadro] } : dados;

  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };
  let totalChamados = 0;

  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Relatório de Chamados por Status - Resumido
        </Text>
        <Text style={styles.title}>
          {dataInicio && dataFim
            ? `De: ${dataInicio.toLocaleDateString(
                "pt-BR"
              )} - Até: ${dataFim.toLocaleDateString("pt-BR")}`
            : ""}
        </Text>

        {Object.entries(quadrosFiltrados).map(([quadroId, chamados]) => {
          const chamadosFiltrados = chamados.filter((chamado) => {
            const dataChamado = new Date(chamado.criadoEm);
            dataChamado.setHours(0, 0, 0, 0);
            const filtroStatus = status ? chamado.status === status : true;
            const filtroData =
              (!dataInicio || dataChamado >= dataInicio) &&
              (!dataFim || dataChamado <= dataFim);
            return filtroStatus && filtroData;
          });

          if (chamadosFiltrados.length === 0) return null;

          return (
            <View key={quadroId}>
              <View style={styles.quadroTitleContainer}>
                <Text style={styles.quadroTitle}>
                  Quadro: {getQuadroNome(Number(quadroId))}
                </Text>
                <Text style={styles.quadroTitle}>
                  Total: {chamadosFiltrados.length}
                </Text>
              </View>
              {/* Cabeçalho da Tabela */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Data</Text>
                <Text style={styles.tableHeaderCell}>Nº</Text>
                <Text style={styles.tableHeaderCell}>Cliente</Text>
                <Text style={styles.tableHeaderCell}>Status</Text>
              </View>

              {/* Linhas da Tabela */}
              {chamadosFiltrados.map((chamado) => {
                totalChamados++;
                return (
                  <View style={styles.tableRow} key={chamado.id}>
                    <Text style={styles.tableCell}>
                      {new Date(chamado.criadoEm).toLocaleDateString()}
                    </Text>
                    <Text style={styles.tableCell}>
                      {chamado.numeroSequencial}
                    </Text>
                    <Text style={styles.tableCell}>{chamado.cliente.nome}</Text>
                    <Text style={styles.tableCell}>
                      {statusList[chamado.status]}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
        <Text style={styles.total}>
          Total Geral de Chamados: {totalChamados}
        </Text>
      </Page>
    </Document>
  );
}
