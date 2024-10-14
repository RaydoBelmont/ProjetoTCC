import {
  getHistoricoChamado,
  putHistoricoChamado,
} from "../../../models/Chamados/historico/chamadoHistoricoModel";

export const listaHistoricoChamado = async (chamadoId: number) => {
  try {
    const listaHistorico = await getHistoricoChamado(chamadoId);
    return listaHistorico;
  } catch (error) {
    throw new Error(
      `Erro ao listar histórico do chamado em controller: ${error.message}`
    );
  }
};

export const inserirHistoricoChamado = async (
  chamadoId: number,
  alteradoPorId: number,
  tipo: string,
  descricao: string,
  valorAnterior?: string,
  valorNovo?: string
) => {
  try {
    const historico = await putHistoricoChamado(
      chamadoId,
      alteradoPorId,
      tipo,
      descricao,
      valorAnterior,
      valorNovo
    );
    return historico;
  } catch (error) {
    throw new Error(
      `Erro ao inserir histórico do chamado em controller: ${error.message}`
    );
  }
};
