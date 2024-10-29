import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Chamado, Quadro } from "@/app/workspace/[idWorkspace]/[idSetor]/page";
import { Cliente } from "@/app/workspace/[idWorkspace]/[idSetor]/quadros/Modals/modalCadChamado";

// Definição dos estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
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
  totalByStatusContainer: {
    marginTop: 20,
  },
  totalByStatus: {
    fontSize: 12,
    marginBottom: 3,
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
interface RelChamadosPorClienteResProps {
  dados: { [key: number]: Chamado[] };
  status?: string | null;
  listaQuadros: Quadro[];
  cliente: Cliente | null;
  dataInicial: string | null;
  dataFinal: string | null;
}

// Componente para gerar o PDF do relatório
export default function RelChamadosPorClienteRes({
  dados,
  status,
  listaQuadros,
  cliente,
  dataInicial,
  dataFinal,
}: RelChamadosPorClienteResProps) {
  if (!cliente) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Nenhum cliente selecionado. Por favor, selecione um cliente para
              gerar o relatório.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Função auxiliar para obter o nome do quadro pelo ID
  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };

  // Converte as datas de filtro para o tipo Date, se existirem
  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;

  let totalChamados = 0;
  const chamadosPorStatus: { [key: string]: number } = {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Relatório de Chamados por Cliente - Resumido
          </Text>
          <Text style={styles.subTitle}>
            Cliente: {cliente.nome}{" "}
            {status ? `| Status: ${statusList[status]} ` : ""}
            {dataInicio && dataFim
              ? `| De: ${dataInicio.toLocaleDateString(
                  "pt-BR"
                )} - Até: ${dataFim.toLocaleDateString("pt-BR")}`
              : ""}
          </Text>
        </View>

        {/* Itera sobre cada quadro */}
        {Object.entries(dados).map(([quadroId, chamados]) => {
          const chamadosFiltrados = chamados.filter((chamado) => {
            const dataChamado = new Date(chamado.criadoEm);

            const isDataValida =
              (!dataInicio || dataChamado >= dataInicio) &&
              (!dataFim || dataChamado <= dataFim);
            const isStatusValido = status ? chamado.status === status : true;
            const isClienteValido = chamado.clienteId === cliente.id;

            return isDataValida && isStatusValido && isClienteValido;
          });

          if (chamadosFiltrados.length === 0) return null;

          totalChamados += chamadosFiltrados.length;

          // Conta os chamados por status
          chamadosFiltrados.forEach((chamado) => {
            const statusChamado = statusList[chamado.status];
            chamadosPorStatus[statusChamado] =
              (chamadosPorStatus[statusChamado] || 0) + 1;
          });

          const chamadosDoQuadro = chamadosFiltrados.filter(
            (chamado) => chamado.quadroId === Number(quadroId)
          );

          if (chamadosDoQuadro.length === 0) return null;

          return (
            <View key={quadroId}>
              <View style={styles.quadroTitleContainer}>
                <Text style={styles.quadroTitle}>
                  Quadro: {getQuadroNome(Number(quadroId))}
                </Text>
                <Text style={styles.quadroTitle}>
                  Total: {chamadosDoQuadro.length}
                </Text>
              </View>

              {/* Cabeçalho da Tabela */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Data</Text>
                <Text style={styles.tableHeaderCell}>Nº</Text>
                <Text style={styles.tableHeaderCell}>Cliente</Text>
                <Text style={styles.tableHeaderCell}>Prioridade</Text>
                <Text style={styles.tableHeaderCell}>Status</Text>
              </View>

              {/* Linhas de chamados */}
              {chamadosFiltrados.map((chamado) => (
                <View key={chamado.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {new Date(chamado.criadoEm).toLocaleDateString("pt-BR")}
                  </Text>
                  <Text style={styles.tableCell}>
                    {chamado.numeroSequencial}
                  </Text>
                  <Text style={styles.tableCell}>{chamado.cliente.nome}</Text>
                  <Text style={styles.tableCell}>
                    {chamado.prioridade.nome}
                  </Text>
                  <Text style={styles.tableCell}>
                    {statusList[chamado.status]}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* Total Geral de Chamados */}
        <Text style={styles.total}>
          Total Geral de Chamados: {totalChamados}
        </Text>

        {/* Total de Chamados por Status */}
        <View style={styles.totalByStatusContainer}>
          <Text style={{ fontSize: 13, marginBottom: 5 }}>
            Total por Status:
          </Text>
          {Object.entries(chamadosPorStatus).map(([status, count]) => (
            <Text key={status} style={styles.totalByStatus}>
              {status}: {count}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
