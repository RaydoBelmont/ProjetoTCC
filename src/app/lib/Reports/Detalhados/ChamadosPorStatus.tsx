import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Chamado, Quadro } from "@/app/workspace/[idWorkspace]/[idSetor]/page";

// Definição dos estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#f9f9f9",
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  quadroTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 5,
    borderBottom: "2px solid #aaa",
    marginBottom: 5,
  },
  tituloChamadoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  quadroTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chamado: {
    marginBottom: 10,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  chamadoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  line: {
    borderBottom: "1px solid #ccc",
    marginVertical: 5,
  },
  total: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "right",
  },
  totalByStatus: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "left",
  },
  totalChamados: {
    fontSize: 12,
    fontWeight: "bold",
  },
  descricao: {
    fontSize: 12,
  },
  containerQuadro: {
    justifyContent: "space-between",
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
interface RelChamadosPorStatusProps {
  dados: { [key: number]: Chamado[] };
  idQuadro?: number;
  status?: string | null;
  listaQuadros: Quadro[];
  dataInicial: string | null;
  dataFinal: string | null;
}

// Componente para gerar o PDF do relatório
export default function RelChamadosPorStatus({
  dados,
  idQuadro,
  status,
  listaQuadros,
  dataInicial,
  dataFinal,
}: RelChamadosPorStatusProps) {
  const quadrosFiltrados = idQuadro ? { [idQuadro]: dados[idQuadro] } : dados;

  // Função auxiliar para obter o nome do quadro pelo ID
  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };

  // Converte as datas de filtro para Date para comparação
  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;

  let totalChamados = 0;
  const totalPorStatus = {
    EM_ABERTO: 0,
    EM_ANALISE: 0,
    EM_ESPERA: 0,
    EM_ANDAMENTO: 0,
    CONCLUIDO: 0,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>
            Relatório de Chamados
            {status ? ` - Status: ${statusList[status]}` : ""}
          </Text>

          {Object.entries(quadrosFiltrados).map(([quadroId, chamados]) => {
            const chamadosFiltrados = chamados.filter((chamado) => {
              const filtroStatus = status ? chamado.status === status : true;
              const dataChamado = new Date(chamado.criadoEm);

              const filtroData =
                (!dataInicio || dataChamado >= dataInicio) &&
                (!dataFim || dataChamado <= dataFim);

              return filtroStatus && filtroData;
            });

            if (chamadosFiltrados.length === 0) return null;

            totalChamados += chamadosFiltrados.length;

            return (
              <View key={quadroId}>
                <View style={styles.quadroTitleContainer}>
                  <Text style={styles.quadroTitle}>
                    Quadro: {getQuadroNome(Number(quadroId))}
                  </Text>
                  <Text style={styles.totalChamados}>
                    Total de Chamados: {chamadosFiltrados.length}
                  </Text>
                </View>

                {chamadosFiltrados.map((chamado) => {
                  totalPorStatus[
                    chamado.status as keyof typeof totalPorStatus
                  ]++;

                  return (
                    <View key={chamado.id} style={styles.chamado}>
                      <View style={styles.tituloChamadoContainer}>
                        <Text>
                          Data de criação:{" "}
                          {new Date(chamado.criadoEm).toLocaleDateString()}
                        </Text>
                        <Text style={styles.chamadoTitle}>
                          Nª: {chamado.numeroSequencial}
                        </Text>
                      </View>
                      <Text style={styles.chamadoTitle}>
                        Título: {chamado.titulo.split("")}
                      </Text>
                      <Text style={{ marginBottom: 2 }}>
                        Cliente: {chamado.cliente.nome}
                      </Text>
                      <Text style={{ marginBottom: 5 }}>
                        Status: {statusList[chamado.status]}
                      </Text>
                      <Text style={styles.descricao}>
                        Descrição: {chamado.descricao.split("")}
                      </Text>
                      {chamado.solucao && (
                        <Text style={{ fontSize: 12, marginTop: 2 }}>
                          Solução: {chamado.solucao.split("")}
                        </Text>
                      )}
                      <View style={styles.line} />
                    </View>
                  );
                })}
              </View>
            );
          })}

          <Text style={styles.total}>
            Total Geral de Chamados: {totalChamados}
          </Text>

          <View style={styles.totalByStatus} break>
            <Text>Total por Status:</Text>
            {Object.entries(totalPorStatus).map(([statusKey, count]) => (
              <Text key={statusKey}>
                {statusList[statusKey as keyof typeof statusList]}: {count}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
