import {
  criarChamado,
  buscarChamadosPorQuadro,
} from "../../models/Chamados/chamados";

export const listaChamadosPorQuadro = async (quadroId: number) => {
  try {
    const listaDeChamados = await buscarChamadosPorQuadro(quadroId);
    return listaDeChamados;
  } catch (error) {
    console.error("Erro na listagem de chamados em Controller", error);
  }
};

export const insereChamado = async (
  clienteId: number,
  titulo: string,
  descricao: string,
  statusId: number,
  prioridadeId: number,
  membroId: number,
  quadroId: number,
  workspaceId: number
) => {
  try {
    const novoChamado = await criarChamado(
      clienteId,
      titulo,
      descricao,
      statusId,
      prioridadeId,
      membroId,
      quadroId,
      workspaceId
    );
    return novoChamado;
  } catch (error) {
    console.error("Erro na inserção de chamado em Controller", error);
  }
};
