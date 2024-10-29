import {
  criarChamado,
  buscarChamadosPorQuadro,
  alterarChamado,
  inserirMembro,
  removerMembro,
  buscaChamado,
  transferirChamado,
  finalizarChamado,
  reabrirChamado,
  arquivarChamado,
  desarquivarChamado
} from "../../models/Chamados/chamados";

import { StatusEnum } from "@prisma/client";

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
  NovoStatus?: StatusEnum,
  idNovaPrioridade?: number,
  novaDescricao?: string,
  idNovoCliente?: number
) => {
  try {
    const chamado = await alterarChamado(
      idChamdo,
      NovoStatus,
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

export const finalizaChamado = async (idChamado: number, solucao: string) => {
  try {
    const chamadoFinalizado = await finalizarChamado(idChamado, solucao);
    return chamadoFinalizado;
  } catch (error) {
    console.error("Erro ao finalizar chamado em Controller", error);
  }
}

export const reabreChamado = async (idChamado: number) => {
  try {
    const chamadoReaberto = await reabrirChamado(idChamado);
    return chamadoReaberto;
  } catch (error) {
    console.error("Erro ao reabrir chamado em Controller", error);
  }
}

export const arquivaChamado = async (idChamado: number) => {
  try {
    const chamadoArquivado = await arquivarChamado(idChamado);
    return chamadoArquivado;
  } catch (error) {
    console.error("Erro ao arquivar chamado em Controller", error);
  }
}

export const desarquivaChamado = async (idChamado: number) => {
  try {
    const chamadoDesarquivado = await desarquivarChamado(idChamado);
    return chamadoDesarquivado;
  } catch (error) {
    console.error("Erro ao desarquivar chamado em Controller", error);
  }
}