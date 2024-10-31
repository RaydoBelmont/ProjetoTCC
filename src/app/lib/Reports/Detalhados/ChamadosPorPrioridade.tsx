import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Chamado, Quadro } from "@/app/workspace/[idWorkspace]/[idSetor]/page";
import { Prioridade } from "@/app/workspace/[idWorkspace]/[idSetor]/quadros/Modals/modalCadChamado";

// Definição dos estilos
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
  prioridadeTitleContainer: {
    backgroundColor: "#d9d9d9", // Cor de fundo para a prioridade
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
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
    backgroundColor: "#e0e0e0", // Cor de fundo para o quadro
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  tituloChamadoContainer: {
    flexDirection: "row", // Alinha os itens em uma linha
    justifyContent: "space-between", // Separa o nome e o total de chamados
    alignItems: "center", // Alinha verticalmente
    marginBottom: 5,
  },
  quadroTitle: {
    fontSize: 14,
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
    marginBottom: 2, // Ajuste na margem inferior para mais espaçamento
  },
  descricao: {
    fontSize: 12,
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
interface RelChamadosProps {
  dados: { [key: number]: Chamado[] }; // Chamados organizados por quadro
  listaQuadros: Quadro[]; // Lista de quadros
  prioridadeSelecionada: Prioridade | null;
  dataInicial: string | null;
  dataFinal: string | null;
}

export default function RelChamadosPorPrioridade({
  dados,
  listaQuadros,
  prioridadeSelecionada,
  dataInicial,
  dataFinal,
}: RelChamadosProps) {
  // Função auxiliar para obter o nome do quadro pelo ID
  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };

  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;
  let totalChamados = 0;

  // Agrupar chamados por prioridade e aplicar filtros de data e prioridade
  const chamadosAgrupadosPorPrioridade = Object.values(dados).flatMap(
    (chamados) => {
      return chamados.filter((chamado) => {
        const dataChamado = new Date(chamado.criadoEm);
        const isDataValida =
          (!dataInicio || dataChamado >= dataInicio) &&
          (!dataFim || dataChamado <= dataFim);
        const isPrioridadeValida =
          !prioridadeSelecionada ||
          chamado.prioridadeId === prioridadeSelecionada.id;
        return isDataValida && isPrioridadeValida;
      });
    }
  );

  // Obter as prioridades exclusivas para ordenar e agrupar
  const prioridadesUnicas = Array.from(
    new Set(chamadosAgrupadosPorPrioridade.map((c) => c.prioridade.nome))
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Relatório de Chamados por Prioridade</Text>
          <Text style={styles.title}>
            {dataInicio && dataFim
              ? `De: ${dataInicio.toLocaleDateString(
                  "pt-BR"
                )} - Até: ${dataFim.toLocaleDateString("pt-BR")}`
              : ""}
          </Text>

          {/* Itera sobre as prioridades e, em seguida, pelos quadros */}
          {prioridadesUnicas.map((prioridadeNome, index) => {
            const chamadosPorPrioridade = chamadosAgrupadosPorPrioridade.filter(
              (chamado) => chamado.prioridade.nome === prioridadeNome
            );
            if (chamadosPorPrioridade.length === 0) return null;

            return (
              // Aplica o break apenas se não for o primeiro elemento
              <View key={prioridadeNome} break={index !== 0}>
                <Text style={styles.prioridadeTitle}>
                  Prioridade: {prioridadeNome}
                </Text>
                <View style={styles.lineSeparator} />

                {/* Agrupa os chamados por quadro */}
                {Object.entries(dados).map(([quadroId, chamados]) => {
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
                        <Text style={styles.quadroTitle}>
                          Total de Chamados: {chamadosDoQuadro.length}
                        </Text>
                      </View>

                      {/* Exibe os chamados dentro do quadro */}
                      {chamadosDoQuadro.map((chamado, index) => {
                        totalChamados++;

                        return (
                          <View
                            key={chamado.id}
                            style={styles.chamado}
                            break={index !== 0}
                          >
                            <View style={styles.tituloChamadoContainer}>
                              <Text>
                                Data:{" "}
                                {new Date(
                                  chamado.criadoEm
                                ).toLocaleDateString()}
                              </Text>
                              <Text style={styles.chamadoTitle}>
                                Nª: {chamado.numeroSequencial}
                              </Text>
                            </View>
                            {chamado.concluidoEm && (
                              <Text style={{ marginBottom: 5 }}>
                                Data de conclusão:{" "}
                                {new Date(
                                  chamado.concluidoEm
                                ).toLocaleDateString()}
                              </Text>
                            )}
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
                                Solução: {chamado.solucao}
                              </Text>
                            )}
                            <View style={styles.line} />
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Exibe o total geral de chamados */}
          <Text style={styles.total}>
            Total Geral de Chamados: {totalChamados}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
