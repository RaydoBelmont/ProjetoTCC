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
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
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
interface RelChamadosPorClienteProps {
  dados: { [key: number]: Chamado[] }; // Chamados organizados por quadro
  status?: string | null; // Status do chamado selecionado
  listaQuadros: Quadro[]; // Lista de quadros
  cliente: Cliente | null; // Cliente selecionado
  dataInicial: string | null;
  dataFinal: string | null;
}

// Componente para gerar o PDF do relatório completo
export default function RelChamadosPorCliente({
  dados,
  status,
  listaQuadros,
  cliente,
  dataInicial,
  dataFinal
}: RelChamadosPorClienteProps) {
  if (!cliente) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>
              Nenhum cliente selecionado. Por favor, selecione um cliente para
              gerar o relatório.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  const getQuadroNome = (quadroId: number): string => {
    const quadro = listaQuadros.find((q) => q.id === Number(quadroId));
    return quadro ? quadro.nome : `ID: ${quadroId}`;
  };

  let totalChamados = 0;
  const totalPorStatus = {
    EM_ABERTO: 0,
    EM_ANALISE: 0,
    EM_ESPERA: 0,
    EM_ANDAMENTO: 0,
    CONCLUIDO: 0,
  };

  // Converte as datas de filtro para o tipo Date, se existirem
  const dataInicio = dataInicial ? new Date(dataInicial + "T00:00:00") : null;
  const dataFim = dataFinal ? new Date(dataFinal + "T23:59:59") : null;


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>
            Relatório de Chamados por Cliente
            {status ? ` - Status: ${statusList[status]}` : ""}
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

          {/* Itera sobre cada quadro */}
          {Object.entries(dados).map(([quadroId, chamados]) => {
            const chamadosFiltrados = chamados.filter((chamado) => {
              const dataChamado = new Date(chamado.criadoEm);
              const isInDateRange = (!dataInicio || dataChamado >= dataInicio) && (!dataFim || dataChamado <= dataFim);
              const matchesStatus = status ? chamado.status === status : true;
              return chamado.clienteId === cliente.id && matchesStatus && isInDateRange;
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
                  totalPorStatus[chamado.status as keyof typeof totalPorStatus]++;

                  return (
                    <View key={chamado.id} style={styles.chamado}>
                      <View style={styles.tituloChamadoContainer}>
                        <Text>
                          Data de criação: {new Date(chamado.criadoEm).toLocaleDateString()}
                        </Text>
                        <Text style={styles.chamadoTitle}>
                          Nª: {chamado.numeroSequencial}
                        </Text>
                      </View>
                      <Text style={styles.chamadoTitle}>
                        Título: {chamado.titulo}
                      </Text>
                      <Text style={{ marginBottom: 2 }}>
                        Cliente: {chamado.cliente.nome}
                      </Text>
                      <Text style={{ marginBottom: 5 }}>
                        Status: {statusList[chamado.status]}
                      </Text>
                      <Text style={styles.descricao}>
                        Descrição: {chamado.descricao}
                      </Text>
                      {chamado.solucao && (
                        <Text style={{fontSize: 12, marginTop: 2}}>
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

          <Text style={styles.total}>
            Total Geral de Chamados: {totalChamados}
          </Text>

          <View style={styles.totalByStatus} break>
            <Text style={{ marginBottom: 5 }}>Total por Status</Text>
            {Object.entries(totalPorStatus).map(([statusKey, count]) => (
              <Text key={statusKey} style={{ marginBottom: 2 }}>
                {statusList[statusKey as keyof typeof statusList]}: {count}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
