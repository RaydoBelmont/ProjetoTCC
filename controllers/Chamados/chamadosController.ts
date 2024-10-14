import {
  criarChamado,
  buscarChamadosPorQuadro,
  alterarChamado,
  inserirMembro,
  removerMembro,
  buscaChamado,
  transferirChamado
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

export const alteraChamado = async (
  idChamdo: number,
  idNovoStatus?: number,
  idNovaPrioridade?: number,
  novaDescricao?: string,
  idNovoCliente?: number
) => {
  try {
    const chamado = await alterarChamado(
      idChamdo,
      idNovoStatus,
      idNovaPrioridade,
      novaDescricao,
      idNovoCliente
    );

    return chamado;
  } catch (error) {
    console.error("Erro na alteração de chamado em Controller", error);
  }
};

export const insereMembro = async (idChamado: number, idNovoMembro: number) => {
  try {
    const membro = await inserirMembro(idChamado, idNovoMembro);
    return membro
  } catch (error) {
    console.error("Erro na inserção de membro em Controller", error);
  }
}

export const removeMembro = async (idChamado: number, idMembroRemover: number) => {
  try {
    const membro = await removerMembro(idChamado, idMembroRemover);
    return membro
  } catch (error) {
    console.error("Erro na remoção de membro em Controller", error);
  }
}

export const buscarChamado = async (idChamado: number) => {
  try {
    const chamado = await buscaChamado(idChamado);
    return chamado;
  } catch (error) {
    console.error("Erro na busca de chamado em Controller", error);
  }
}

export const transfereChamado = async (idChamado: number, idQuadro: number) => {
  try {
    const quadro = await transferirChamado(idChamado, idQuadro);
    return quadro;
  } catch (error) {
    console.error("Erro ao transferir chamado em Controller", error);
  }
}